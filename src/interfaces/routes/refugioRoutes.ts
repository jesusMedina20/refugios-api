import { Router } from 'express';
import { RefugioController } from '../controllers/RefugioController';
import { validate, createRefugioSchema, updateRefugioSchema } from '../middleware/validation';
import { asyncHandler } from './asyncHandler';

export function createRefugioRoutes(controller: RefugioController): Router {
  const router = Router();

  router.get('/', asyncHandler(controller.getAll.bind(controller)));
  router.get('/:id', asyncHandler(controller.getById.bind(controller)));
  router.post('/', validate(createRefugioSchema), asyncHandler(controller.create.bind(controller)));
  router.patch(
    '/:id',
    validate(updateRefugioSchema),
    asyncHandler(controller.update.bind(controller))
  );

  return router;
}
