import { barberShopRoutes } from '@modules/BarberShop/infra/http/routes/barberShop.routes';
import { authRoutes } from '@modules/User/infra/http/routes/auth.routes';
import { userRoutes } from '@modules/User/infra/http/routes/user.routes';
import { Router } from 'express';

export const appRoutes = Router();

appRoutes.use('/auth', authRoutes);
appRoutes.use('/users', userRoutes);
appRoutes.use('/barber-shop', barberShopRoutes);
