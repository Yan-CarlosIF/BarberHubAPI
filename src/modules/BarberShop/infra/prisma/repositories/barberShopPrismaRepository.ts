import type { ICreateBarberShopDTO } from '@modules/BarberShop/dtos/IcreateBarberShopDTO';
import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { prisma } from '@shared/infra/prisma/client';
import type { BarberShop } from '../entities/BarberShop';

export class BarberShopPrismaRepository implements IBarberShopRepository {
	async create({
		cep,
		city,
		description,
		email,
		name,
		phone,
		state,
		street,
	}: ICreateBarberShopDTO): Promise<void> {
		await prisma.barberShop.create({
			data: {
				cep,
				city,
				description,
				email,
				name,
				phone,
				state,
				street,
			},
		});
	}

	async delete(id: string): Promise<void> {
		await prisma.barberShop.delete({
			where: { id },
		});
	}

	async findById(id: string): Promise<BarberShop | null> {
		return await prisma.barberShop.findUnique({
			where: { id },
		});
	}

	async findByPhone(phone: string): Promise<BarberShop | null> {
		return await prisma.barberShop.findUnique({
			where: { phone },
		});
	}

	async findByEmail(email: string): Promise<BarberShop | null> {
		return await prisma.barberShop.findUnique({
			where: { email },
		});
	}
}
