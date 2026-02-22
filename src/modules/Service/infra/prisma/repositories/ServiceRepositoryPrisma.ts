import type { ICreateServiceDTO } from '@modules/Service/dtos/ICreateServiceDTO';
import type { IUpdateServiceDTO } from '@modules/Service/dtos/IUpdateServiceDTO';
import type { IServiceRepository } from '@modules/Service/repositories/IServiceRepository';
import { prisma } from '@shared/infra/prisma/client';
import type { Service } from '../entities/Service';

export class ServiceRepositoryPrisma implements IServiceRepository {
	async create({
		barberShopId,
		durationInMinutes,
		name,
		price,
		description,
	}: ICreateServiceDTO): Promise<void> {
		await prisma.service.create({
			data: {
				name,
				description,
				price,
				barberShopId,
				durationInMinutes,
			},
		});
	}

	async findById(id: string): Promise<Service | null> {
		return await prisma.service.findUnique({
			where: {
				id,
			},
		});
	}

	async findAllByBarberShopId(barberShopId: string): Promise<Service[]> {
		return await prisma.service.findMany({
			where: {
				barberShopId,
			},
		});
	}

	async update(
		id: string,
		{ description, durationInMinutes, name, price }: IUpdateServiceDTO,
	): Promise<void> {
		await prisma.service.update({
			where: { id },
			data: {
				name,
				description,
				price,
				durationInMinutes,
			},
		});
	}

	async delete(id: string): Promise<void> {
		await prisma.service.delete({
			where: { id },
		});
	}
}
