import { UserRepositoryPrisma } from '@modules/User/infra/prisma/repositories/UserRepositoryPrisma';
import type { IUserRepository } from '@modules/User/repository/IuserRepository';
import { container } from 'tsyringe';

container.registerSingleton<IUserRepository>(
	'UserRepository',
	UserRepositoryPrisma,
);
