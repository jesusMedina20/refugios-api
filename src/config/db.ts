import mongoose from 'mongoose';

export async function connectDB(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log('[DB] Conectado a MongoDB');
  } catch (err) {
    console.error('[DB] Error al conectar con MongoDB:', err);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('[DB] Error de conexión MongoDB:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[DB] MongoDB desconectado');
  });
}
