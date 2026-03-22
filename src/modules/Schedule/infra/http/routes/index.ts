import { adminMiddleware } from '@shared/infra/http/middlewares/admin.middleware';
import { authMiddleware } from '@shared/infra/http/middlewares/auth.middleware';
import { Router } from 'express';
import { ScheduleController } from '../controllers/ScheduleController';

export const scheduleRoutes = Router();
const scheduleController = new ScheduleController();

// Client creates a new schedule
scheduleRoutes.post(
  '/:barberShopIdOrSlug',
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
  '/:barberShopIdOrSlug',
  authMiddleware,
  adminMiddleware,
  scheduleController.listByBarberShop,
);

// List all schedules of a specific barber within a barber shop
scheduleRoutes.get(
  '/:barberShopIdOrSlug/barber/:barberId',
  authMiddleware,
  scheduleController.listByBarber,
);

// Cancel a schedule
scheduleRoutes.patch(
  '/:barberShopIdOrSlug/:id/cancel',
  authMiddleware,
  scheduleController.cancel,
);

// Update schedule status (admin / barber: COMPLETED, NO_SHOW)
scheduleRoutes.patch(
  '/:barberShopIdOrSlug/:id/status',
  authMiddleware,
  adminMiddleware,
  scheduleController.updateStatus,
);
