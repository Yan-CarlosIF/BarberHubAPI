import { adminMiddleware } from '@shared/infra/http/middlewares/admin.middleware';
import { authMiddleware } from '@shared/infra/http/middlewares/auth.middleware';
import { Router } from 'express';
import { BarberController } from '../controllers/BarberController';

export const barberRoutes = Router();
const barberController = new BarberController();

// ── Availability ──────────────────────────────────────────

// Set (create/replace) availability for a barber on a given week day
barberRoutes.post(
  '/:barberId/availability',
  authMiddleware,
  adminMiddleware,
  barberController.setAvailability,
);

// List all availability entries for a barber
barberRoutes.get(
  '/:barberId/availability',
  authMiddleware,
  barberController.listAvailability,
);

// Delete all availability for a barber (reset schedule)
barberRoutes.delete(
  '/:barberId/availability',
  authMiddleware,
  adminMiddleware,
  barberController.deleteAvailability,
);

// ── Blocks ────────────────────────────────────────────────

// Create a time block for a barber
barberRoutes.post(
  '/:barberId/blocks',
  authMiddleware,
  adminMiddleware,
  barberController.createBlock,
);

// List all blocks for a barber
barberRoutes.get(
  '/:barberId/blocks',
  authMiddleware,
  barberController.listBlocks,
);

// Delete a specific block
barberRoutes.delete(
  '/:barberId/blocks/:blockId',
  authMiddleware,
  adminMiddleware,
  barberController.deleteBlock,
);

// ── BarberService (assign/unassign services) ─────────────

// Assign a service to a barber
barberRoutes.post(
  '/:barberId/services',
  authMiddleware,
  adminMiddleware,
  barberController.assignService,
);

// List services assigned to a barber
barberRoutes.get(
  '/:barberId/services',
  authMiddleware,
  barberController.listServices,
);

// Unassign a service from a barber
barberRoutes.delete(
  '/:barberId/services/:serviceId',
  authMiddleware,
  adminMiddleware,
  barberController.unassignService,
);

// ── Barber CRUD (scoped by barber shop) ──────────────────

// Create a barber in a barber shop
barberRoutes.post(
  '/:barberShopIdOrSlug',
  authMiddleware,
  adminMiddleware,
  barberController.createBarberHandle,
);

// List barbers by barber shop
barberRoutes.get('/:barberShopIdOrSlug', barberController.listBarbersHandle);

// List barbers with pagination
barberRoutes.get(
  '/:barberShopIdOrSlug/pagination',
  barberController.listBarbersPaginationHandle,
);

// Delete a barber
barberRoutes.delete(
  '/:barberShopIdOrSlug/:id',
  authMiddleware,
  adminMiddleware,
  barberController.deleteBarberHandle,
);

// Update a barber
barberRoutes.patch(
  '/:barberShopIdOrSlug/:id',
  authMiddleware,
  adminMiddleware,
  barberController.updateBarberHandle,
);
