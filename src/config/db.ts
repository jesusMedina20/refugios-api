import mongoose from 'mongoose';

export type DbStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

let dbStatus: DbStatus = 'disconnected';

export function getDbStatus(): DbStatus {
  // readyState: 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  const rs = mongoose.connection.readyState;
  if (rs === 1) return 'connected';
  if (rs === 2) return 'connecting';
  return dbStatus;
}

type ConnectOptions = {
  /** Si true, hace process.exit(1) al fallar (útil para scripts/seed) */
  exitOnFail?: boolean;
};

export async function connectDB(uri: string, options?: ConnectOptions): Promise<void> {
  dbStatus = 'connecting';

  mongoose.connection.on('connected', () => {
    dbStatus = 'connected';
    console.log('[DB] Conectado a MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    dbStatus = 'error';
    console.error('[DB] Error de conexión MongoDB:', (err as Error).message);
  });

  mongoose.connection.on('disconnected', () => {
    dbStatus = 'disconnected';
    console.warn('[DB] MongoDB desconectado');
  });

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s para elegir servidor
      bufferCommands: false,           // no bufferear — falla rápido
    });
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'error';
    console.error('[DB] No se pudo conectar a MongoDB:', (err as Error).message);

    if (options?.exitOnFail) {
      process.exit(1);
    }

    console.warn('[DB] La API arrancará sin base de datos. Intentando reconectar…');
    // Mongoose + el driver reintentan automáticamente en background
  }
}
