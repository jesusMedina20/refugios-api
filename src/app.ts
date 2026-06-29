import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db';
import { RefugioController } from './interfaces/controllers/RefugioController';
import { createRefugioRoutes } from './interfaces/routes/refugioRoutes';
import { errorHandler } from './interfaces/middleware/errorHandler';
import { sanitizeInput } from './interfaces/middleware/sanitize';
import { MongoRefugioRepository } from './infrastructure/database/repositories/MongoRefugioRepository';
import { RedisCacheService } from './infrastructure/cache/RedisCacheService';

async function main(): Promise<void> {
  const port = process.env.PORT ?? '3000';
  const mongoUri = process.env.MONGO_URI;
  const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3002';

  if (!mongoUri) {
    console.error('[APP] MONGO_URI no está definida en .env');
    process.exit(1);
  }

  await connectDB(mongoUri);

  // Inicializa cache Redis (la conexión es lazy — si REDIS_URL no está o falla,
  // el cache se desactiva y la API funciona igual)
  RedisCacheService.getInstance();

  const app = express();

  // Confía en proxy inverso (Render, Railway, etc.) para IP real en rate-limit
  app.set('trust proxy', 1);

  // ── Seguridad ──────────────────────────────────────────────
  app.use(helmet());                                     // Security HTTP headers
  app.use(
    cors({
      origin: corsOrigin,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type'],
    })
  );                                                     // CORS restringido
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,                         // 15 minutos
      max: 100,                                          // máximo 100 requests por ventana
      standardHeaders: true,                             // RateLimit-* headers (draft-6)
      legacyHeaders: false,                              // sin X-RateLimit-*
      message: { success: false, error: 'Demasiadas solicitudes, intente de nuevo más tarde' },
    })
  );                                                     // Rate limiting
  app.use(express.json({ limit: '10kb' }));              // Body parsing con límite de tamaño
  app.use(sanitizeInput);                                // XSS sanitization

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
