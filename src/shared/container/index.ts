import { BarberShopPrismaRepository } from '@modules/BarberShop/infra/prisma/repositories/barberShopPrismaRepository';
import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { ScheduleRepositoryPrisma } from '@modules/Schedule/infra/prisma/repositories/ScheduleRepositoryPrisma';
import type { IScheduleRepository } from '@modules/Schedule/repositories/IScheduleRepository';
import { ServiceRepositoryPrisma } from '@modules/Service/infra/prisma/repositories/ServiceRepositoryPrisma';
import type { IServiceRepository } from '@modules/Service/repositories/IServiceRepository';
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

container.registerSingleton<IServiceRepository>(
	'ServiceRepository',
	ServiceRepositoryPrisma,
);

container.registerSingleton<IScheduleRepository>(
	'ScheduleRepository',
	ScheduleRepositoryPrisma,
);
