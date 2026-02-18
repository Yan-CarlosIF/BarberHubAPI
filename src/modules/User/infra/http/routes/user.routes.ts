import { adminMiddleware } from '@shared/infra/http/middlewares/admin.middleware';
import { authMiddleware } from '@shared/infra/http/middlewares/auth.middleware';
import { superAdminMiddleware } from '@shared/infra/http/middlewares/superAdmin.middleware';
import { Router } from 'express';
import { UserController } from '../controllers/userController';

export const userRoutes = Router();

const userController = new UserController();

userRoutes.post(
	'/:barberShopId/admin',
	authMiddleware,
	superAdminMiddleware,
	userController.createAdminHandle,
);

// Barber routes
userRoutes.post(
	'/:barberShopId/barbers',
	authMiddleware,
	adminMiddleware,
	userController.createBarberHandle,
);
userRoutes.get('/:barberShopId/barbers', userController.listBarbersHandle);
userRoutes.delete(
	'/:barberShopId/barbers/:id',
	authMiddleware,
	adminMiddleware,
	userController.deleteBarberHandle,
);
userRoutes.patch(
	'/:barberShopId/barbers/:id',
	authMiddleware,
	adminMiddleware,
	userController.updateBarberHandle,
);
