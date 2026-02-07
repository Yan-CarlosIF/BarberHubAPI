import type { ICreateBarberDTO } from '@modules/User/dtos/IcreateBarberDTO';
import type { ICreateClientDTO } from '@modules/User/dtos/IcreateClientDTO';
import type { ICreateUserDTO } from '@modules/User/dtos/IcreateUserDTO';
import type { IUserRepository } from '@modules/User/repository/IuserRepository';
import { $Enums } from '@prisma/client/generated/browser.js';
import { prisma } from '@shared/prisma/client';
import type { User } from '../entities/User';

export class UserRepositoryPrisma implements IUserRepository {
	async createClient(data: ICreateClientDTO): Promise<void> {
		await prisma.client.create({
			data: {
				user: {
					create: {
						name: data.name,
						email: data.email,
						password: data.password,
						barberShopId: data.barberShopId,
						role: $Enums.Role.CLIENT,
					},
				},
				phone: data.phone,
				birthDate: data.birthDate,
			},
		});
	}

	async createBarber(data: ICreateBarberDTO): Promise<void> {
		await prisma.barber.create({
			data: {
				user: {
					create: {
						name: data.name,
						email: data.email,
						password: data.password,
						barberShopId: data.barberShopId,
						role: $Enums.Role.BARBER,
					},
				},
				specialty: data.specialty,
			},
		});
	}

	async createAdmin(data: ICreateUserDTO): Promise<void> {
		await prisma.user.create({
			data: {
				name: data.name,
				email: data.email,
				password: data.password,
				barberShopId: data.barberShopId,
				role: $Enums.Role.ADMIN,
			},
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		return await prisma.user.findUnique({
			where: { email },
		});
	}
}
