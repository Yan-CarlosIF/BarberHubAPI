import { Router } from 'express';
import { UserController } from '../controllers/userController';

export const authRoutes = Router();

const registerClientController = new UserController();

authRoutes.post(
  '/:barberShopIdOrSlug/register',
  registerClientController.registerClientHandle,
);
authRoutes.post('/login', registerClientController.loginHandle);
