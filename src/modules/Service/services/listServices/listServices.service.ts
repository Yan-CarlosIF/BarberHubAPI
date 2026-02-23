import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';
import type { IServiceRepository } from '../../repositories/IServiceRepository';

@injectable()
export class ListServicesService {
	constructor(
		@inject('ServiceRepository')
		private serviceRepository: IServiceRepository,
		@inject('BarberShopRepository')
		private barberShopRepository: IBarberShopRepository,
	) {}

	async execute(barberShopId: string) {
		const barberShopExists =
			await this.barberShopRepository.findById(barberShopId);

		if (!barberShopExists) {
			throw new AppError('Barber shop not found', 404);
		}

		const services =
			await this.serviceRepository.findAllByBarberShopId(barberShopId);

		return services;
	}
}
