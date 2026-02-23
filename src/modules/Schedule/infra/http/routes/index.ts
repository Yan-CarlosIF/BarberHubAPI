import { adminMiddleware } from '@shared/infra/http/middlewares/admin.middleware';
import { authMiddleware } from '@shared/infra/http/middlewares/auth.middleware';
import { Router } from 'express';
import { ScheduleController } from '../controllers/ScheduleController';

export const scheduleRoutes = Router();
const scheduleController = new ScheduleController();

// Client creates a new schedule
scheduleRoutes.post(
	'/:barberShopId',
	authMiddleware,
	scheduleController.create,
);

// List schedules for the authenticated client
scheduleRoutes.get(
	'/my-schedules',
	authMiddleware,
	scheduleController.listByClient,
);

// List all schedules of a barber shop (admin only)
scheduleRoutes.get(
	'/:barberShopId',
	authMiddleware,
	adminMiddleware,
	scheduleController.listByBarberShop,
);

// List all schedules of a specific barber within a barber shop
scheduleRoutes.get(
	'/:barberShopId/barber/:barberId',
	authMiddleware,
	scheduleController.listByBarber,
);

// Cancel a schedule
scheduleRoutes.patch(
	'/:barberShopId/:id/cancel',
	authMiddleware,
	scheduleController.cancel,
);

// Update schedule status (admin / barber: COMPLETED, NO_SHOW)
scheduleRoutes.patch(
	'/:barberShopId/:id/status',
	authMiddleware,
	adminMiddleware,
	scheduleController.updateStatus,
);
