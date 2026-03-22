import { authMiddleware } from '@shared/infra/http/middlewares/auth.middleware';
import { superAdminMiddleware } from '@shared/infra/http/middlewares/superAdmin.middleware';
import { Router } from 'express';
import { BarberShopController } from '../controllers/barberShopController';

export const barberShopRoutes = Router();

const barberShopController = new BarberShopController();

barberShopRoutes.post(
  '/',
  authMiddleware,
  superAdminMiddleware,
  barberShopController.create,
);
barberShopRoutes.delete(
  '/:id',
  authMiddleware,
  superAdminMiddleware,
  barberShopController.delete,
);
barberShopRoutes.get(
  '/',
  authMiddleware,
  superAdminMiddleware,
  barberShopController.list,
);
barberShopRoutes.get('/:idOrSlug', barberShopController.get);
