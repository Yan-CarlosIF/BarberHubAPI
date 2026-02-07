import { RegisterClientController } from '@modules/User/useCases/registerClient/registerClientController';
import { Router } from 'express';

export const authRoutes = Router();

const registerClientController = new RegisterClientController();

authRoutes.post('/register', registerClientController.handle);
