import { authMiddleware } from '@shared/infra/http/middlewares/auth.middleware';
import { superAdminMiddleware } from '@shared/infra/http/middlewares/superAdmin.middleware';
import { Router } from 'express';
import { UserController } from '../controllers/userController';

export const userRoutes = Router();

const userController = new UserController();

userRoutes.post(
  '/:barberShopIdOrSlug/admin',
  authMiddleware,
  superAdminMiddleware,
  userController.createAdminHandle,
);

userRoutes.get(
  '/:barberShopIdOrSlug/admin',
  authMiddleware,
  superAdminMiddleware,
  userController.listAdminsHandle,
);
