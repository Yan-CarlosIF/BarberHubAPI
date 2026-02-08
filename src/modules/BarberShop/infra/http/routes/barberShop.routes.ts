import { Router } from 'express';
import { BarberShopController } from '../controllers/barberShopController';

export const barberShopRoutes = Router();

const barberShopController = new BarberShopController();

barberShopRoutes.post('/', barberShopController.create);
