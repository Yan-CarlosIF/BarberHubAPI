import { adminMiddleware } from '@shared/infra/http/middlewares/admin.middleware';
import { authMiddleware } from '@shared/infra/http/middlewares/auth.middleware';
import { Router } from 'express';
import { UserController } from '../controllers/userController';

export const userRoutes = Router();

const userController = new UserController();

userRoutes.post(
	'/barbers',
	authMiddleware,
	adminMiddleware,
	userController.createBarberHandle,
);
