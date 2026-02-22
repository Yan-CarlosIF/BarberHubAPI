import type { ICreateServiceDTO } from '@modules/Service/dtos/ICreateServiceDTO';
import type { IUpdateServiceDTO } from '@modules/Service/dtos/IUpdateServiceDTO';
import { Service } from '@modules/Service/infra/prisma/entities/Service';
import { Decimal } from '@prisma/client/runtime/client';
import type { IServiceRepository } from '../IServiceRepository';

export class ServiceRepositoryInMemory implements IServiceRepository {
	services: Service[] = [];

	async create({
		durationInMinutes,
		name,
		price,
		description,
		barberShopId,
	}: ICreateServiceDTO): Promise<void> {
		const service = new Service({
			barberShopId,
			durationInMinutes,
			name,
			price: new Decimal(price),
			description: description ?? null,
			isActive: true,
		});

		this.services.push(service);
	}

	async findById(id: string): Promise<Service | null> {
		return this.services.find((service) => service.id === id) ?? null;
	}

	async findAll(): Promise<Service[]> {
		return this.services;
	}

	async update(id: string, data: IUpdateServiceDTO): Promise<void> {
		const serviceIndex = this.services.findIndex(
			(service) => service.id === id,
		);

		if (serviceIndex === -1) {
			throw new Error('Service not found');
		}

		this.services[serviceIndex] = {
			...this.services[serviceIndex],
			...data,
			price: data.price
				? new Decimal(data.price)
				: this.services[serviceIndex].price,
		};
	}

	async delete(id: string): Promise<void> {
		const serviceIndex = this.services.findIndex(
			(service) => service.id === id,
		);

		if (serviceIndex === -1) {
			throw new Error('Service not found');
		}

		this.services.splice(serviceIndex, 1);
	}
}
