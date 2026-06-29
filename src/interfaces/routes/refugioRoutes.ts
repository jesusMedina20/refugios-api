import { Router } from 'express';
import { RefugioController } from '../controllers/RefugioController';
import { validate, createRefugioSchema, updateRefugioSchema } from '../middleware/validation';
import { asyncHandler } from './asyncHandler';
import { cache, invalidateCache } from '../middleware/cacheMiddleware';

export function createRefugioRoutes(controller: RefugioController): Router {
  const router = Router();

  router.get('/', cache(1200), asyncHandler(controller.getAll.bind(controller)));
  router.get('/:id', cache(1200), asyncHandler(controller.getById.bind(controller)));
  router.post(
    '/',
    invalidateCache('refugios:*'),
    validate(createRefugioSchema),
    asyncHandler(controller.create.bind(controller))
  );

  // PUT: reemplazo completo (usa el schema de creación — nombre + ubicación obligatorios)
  router.put(
    '/:id',
    invalidateCache('refugios:*'),
    validate(createRefugioSchema),
    asyncHandler(controller.replace.bind(controller))
  );

  // PATCH: actualización parcial (solo los campos enviados)
  router.patch(
    '/:id',
    invalidateCache('refugios:*'),
    validate(updateRefugioSchema),
    asyncHandler(controller.update.bind(controller))
  );

  return router;
}
