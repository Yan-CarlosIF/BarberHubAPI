import type { ICreateBarberDTO } from '@modules/User/dtos/IcreateBarberDTO';
import type { ICreateUserDTO } from '@modules/User/dtos/IcreateUserDTO';
import type { IRegisterClientDTO } from '@modules/User/dtos/IregisterClientDTO';
import type { IUserRepository } from '@modules/User/repository/IuserRepository';
import { $Enums } from '@prisma/client';
import { prisma } from '@shared/prisma/client';
import type { Barber } from '../entities/Barber';
import type { User } from '../entities/User';

export class UserRepositoryPrisma implements IUserRepository {
	async createClient(data: IRegisterClientDTO): Promise<void> {
		await prisma.user.create({
			data: {
				name: data.name,
				email: data.email,
				password: data.password,
				barberShopId: data.barberShopId,
				role: $Enums.Role.CLIENT,
				isActive: true,
				client: {
					create: {
						phone: data.phone,
						birthDate: data.birthDate,
						barberShopId: data.barberShopId,
					},
				},
			},
		});
	}

	async createBarber(data: ICreateBarberDTO): Promise<void> {
		await prisma.user.create({
			data: {
				name: data.name,
				email: data.email,
				password: data.password,
				barberShopId: data.barberShopId,
				role: $Enums.Role.BARBER,
				isActive: true,
				barber: {
					create: {
						specialty: data.specialty,
						barberShopId: data.barberShopId,
					},
				},
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
				isActive: true,
			},
		});
	}

	async findByEmail(email: string): Promise<User | null> {
		return await prisma.user.findUnique({
			where: { email },
		});
	}

	async listBarbersByBarbershop(barberShopId: string): Promise<Barber[]> {
		return await prisma.barber.findMany({
			where: { barberShopId },
			include: {
				user: true,
			},
		});
	}
}
