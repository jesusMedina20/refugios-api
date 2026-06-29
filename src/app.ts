import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import { RefugioController } from './interfaces/controllers/RefugioController';
import { createRefugioRoutes } from './interfaces/routes/refugioRoutes';
import { errorHandler } from './interfaces/middleware/errorHandler';
import { MongoRefugioRepository } from './infrastructure/database/repositories/MongoRefugioRepository';
import { RedisCacheService } from './infrastructure/cache/RedisCacheService';

async function main(): Promise<void> {
  const port = process.env.PORT ?? '3000';
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('[APP] MONGO_URI no está definida en .env');
    process.exit(1);
  }

  await connectDB(mongoUri);

  // Inicializa cache Redis (la conexión es lazy — si REDIS_URL no está o falla,
  // el cache se desactiva y la API funciona igual)
  RedisCacheService.getInstance();

  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Dependency injection: controller recibe el repositorio
  const repository = new MongoRefugioRepository();
  const controller = new RefugioController(repository);
  const router = createRefugioRoutes(controller);

  app.use('/refugios', router);

  // Error handler debe ser el último middleware
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`[APP] Refugios API corriendo en http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error('[APP] Error fatal:', err);
  process.exit(1);
});
