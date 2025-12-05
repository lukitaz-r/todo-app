import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Task from '@/models/Task';

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

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const cookieStore = await cookies();
    const deviceId = cookieStore.get('deviceId')?.value;

    if (!deviceId) {
      return NextResponse.json({ error: 'No device ID found' }, { status: 400 });
    }

    if (!body.name || !body.description) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
    }

    const task = await Task.create({ ...body, userId: deviceId });
    return NextResponse.json(task, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: 'Error al crear la tarea', message }, { status: 500 });
  }
}

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