import { adminMiddleware } from '@shared/infra/http/middlewares/admin.middleware';
import { authMiddleware } from '@shared/infra/http/middlewares/auth.middleware';
import { Router } from 'express';
import { ServiceController } from '../controllers/ServiceController';

export const serviceRoutes = Router();
const serviceController = new ServiceController();

serviceRoutes.post(
	'/:barberShopId',
	authMiddleware,
	adminMiddleware,
	serviceController.create,
);

serviceRoutes.get('/:barberShopId', serviceController.list);

serviceRoutes.patch(
	'/:barberShopId/:id',
	authMiddleware,
	adminMiddleware,
	serviceController.update,
);

serviceRoutes.delete(
	'/:barberShopId/:id',
	authMiddleware,
	adminMiddleware,
	serviceController.delete,
);
