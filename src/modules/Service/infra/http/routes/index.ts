import { adminMiddleware } from '@shared/infra/http/middlewares/admin.middleware';
import { authMiddleware } from '@shared/infra/http/middlewares/auth.middleware';
import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';

export const serviceRoutes = Router();
const serviceController = new ServiceController();

serviceRoutes.post(
  '/:barberShopIdOrSlug',
  authMiddleware,
  adminMiddleware,
  serviceController.create,
);

serviceRoutes.get('/:barberShopIdOrSlug', serviceController.list);

serviceRoutes.patch(
  '/:barberShopIdOrSlug/:id',
  authMiddleware,
  adminMiddleware,
  serviceController.update,
);

serviceRoutes.delete(
  '/:barberShopIdOrSlug/:id',
  authMiddleware,
  adminMiddleware,
  serviceController.delete,
);
