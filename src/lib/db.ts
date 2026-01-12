import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Interface for the cached Mongoose connection.
 * Interfaz para la conexión en caché de Mongoose.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global declaration to persist cache across hot reloads in dev
// Declaración global para persistir la caché durante recargas en desarrollo
declare global {
  var mongoose: MongooseCache | undefined;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 * 
 * Se usa una variable global para mantener la conexión en caché durante
 * las recargas en caliente en desarrollo. Esto evita que las conexiones 
 * crezcan exponencialmente al usar Rutas API en un entorno serverless.
 */
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connects to MongoDB reusing the cached connection if available.
 * Conecta a MongoDB reutilizando la conexión en caché si está disponible.
 * 
 * @returns {Promise<typeof mongoose>} The Mongoose connection instance. / La instancia de conexión de Mongoose.
 */
async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
