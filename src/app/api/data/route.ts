import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';

// In-memory rate limit store: ip -> { count, startTime }
// Almacén de límite de velocidad en memoria: ip -> { contador, tiempoInicio }
const rateLimitMap = new Map<string, { count: number; startTime: number }>();
const LIMIT = 10; // Max requests per window / Máx peticiones por ventana
const WINDOW_MS = 60 * 1000; // 1 minute window / Ventana de 1 minuto

/**
 * Checks if a given IP has exceeded the rate limit.
 * Verifica si una IP dada ha excedido el límite de velocidad.
 * 
 * @param {string} ip - The client IP address.
 * @returns {object} Status object with success boolean and remaining time if failed.
 */
function getRateLimitStatus(ip: string) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return { success: true };
  }

  if (now - record.startTime > WINDOW_MS) {
    // Window passed, reset counter
    // La ventana pasó, reiniciar contador
    rateLimitMap.set(ip, { count: 1, startTime: now });
    return { success: true };
  }

  if (record.count >= LIMIT) {
    const remainingTime = Math.ceil((record.startTime + WINDOW_MS - now) / 1000);
    return { success: false, remainingTime };
  }

  record.count += 1;
  return { success: true };
}

/**
 * GET Handler
 * Retrieves all tasks for the current user (identified by deviceId cookie).
 * Recupera todas las tareas del usuario actual (identificado por la cookie deviceId).
 */
export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const deviceId = cookieStore.get('deviceId')?.value;

    if (!deviceId) {
      return NextResponse.json([]);
    }

    const tasks = await Task.find({ userId: deviceId });
    return NextResponse.json(tasks);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Error al obtener las tareas', message }, { status: 500 });
  }
}

/**
 * POST Handler
 * Creates a new task. Protected by Rate Limiting.
 * Crea una nueva tarea. Protegido por Límite de Velocidad.
 */
export async function POST(req: Request) {
  try {
    // Rate Limiting Logic / Lógica de Límite de Velocidad
    const ip = req.headers.get('x-forwarded-for') || 'unknown-ip';
    const rateStatus = getRateLimitStatus(ip);

    if (!rateStatus.success) {
      return NextResponse.json(
        { 
          error: `Rate limit exceeded. Try again in ${rateStatus.remainingTime} seconds.`,
          remainingTime: rateStatus.remainingTime 
        }, 
        { status: 429 }
      );
    }

    await dbConnect();
    const body = await req.json();
    const cookieStore = await cookies();
    const deviceId = cookieStore.get('deviceId')?.value;

    if (!deviceId) {
      return NextResponse.json({ error: 'No device ID found' }, { status: 400 });
    }

    if (!body.name) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const task = await Task.create({ ...body, userId: deviceId });
    return NextResponse.json(task, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Error al crear la tarea', message }, { status: 500 });
  }
}

/**
 * PUT Handler
 * Updates an existing task.
 * Actualiza una tarea existente.
 */
export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const cookieStore = await cookies();
    const deviceId = cookieStore.get('deviceId')?.value;

    if (!deviceId) {
      return NextResponse.json({ error: 'No device ID found' }, { status: 400 });
    }

    if (!body._id && !body.id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    const id = body._id || body.id;
    const task = await Task.findOneAndUpdate(
      { _id: id, userId: deviceId },
      body,
      { new: true }
    );

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Error updating task', message }, { status: 500 });
  }
}

/**
 * DELETE Handler
 * Deletes a specific task or all tasks for the user.
 * Elimina una tarea específica o todas las tareas del usuario.
 */
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const cookieStore = await cookies();
    const deviceId = cookieStore.get('deviceId')?.value;

    if (!deviceId) {
      return NextResponse.json({ error: 'No device ID found' }, { status: 400 });
    }

    if (id) {
      const deletedTask = await Task.findOneAndDelete({ _id: id, userId: deviceId });
      if (!deletedTask) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Task deleted' });
    } else {
      await Task.deleteMany({ userId: deviceId });
      return NextResponse.json({ message: 'All tasks deleted' });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Error deleting tasks', message }, { status: 500 });
  }
}
