import { Router } from 'express';
import { RefugioController } from '../controllers/RefugioController';
import { validate, createRefugioSchema, updateRefugioSchema } from '../middleware/validation';
import { asyncHandler } from './asyncHandler';

export function createRefugioRoutes(controller: RefugioController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.getAll.bind(controller)));
  router.get('/:id', asyncHandler(controller.getById.bind(controller)));
  router.post('/', validate(createRefugioSchema), asyncHandler(controller.create.bind(controller)));

  // PUT: reemplazo completo (usa el schema de creación — nombre + ubicación obligatorios)
  router.put(
    '/:id',
    validate(createRefugioSchema),
    asyncHandler(controller.replace.bind(controller))
  );

  // PATCH: actualización parcial (solo los campos enviados)
  router.patch(
    '/:id',
    validate(updateRefugioSchema),
    asyncHandler(controller.update.bind(controller))
  );

  return router;
}
