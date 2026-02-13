import { BarberShopPrismaRepository } from '@modules/BarberShop/infra/prisma/repositories/barberShopPrismaRepository';
import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { UserRepositoryPrisma } from '@modules/User/infra/prisma/repositories/UserRepositoryPrisma';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { container } from 'tsyringe';

container.registerSingleton<IUserRepository>(
	'UserRepository',
	UserRepositoryPrisma,
);

container.registerSingleton<IBarberShopRepository>(
	'BarberShopRepository',
	BarberShopPrismaRepository,
);
