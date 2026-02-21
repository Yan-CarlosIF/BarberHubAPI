import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class DeleteBarberShopService {
	constructor(
		@inject('BarberShopRepository')
		private barberShopRepository: IBarberShopRepository,
	) {}

	async execute(id: string): Promise<void> {
		const barberShop = await this.barberShopRepository.findById(id);

		if (!barberShop) {
			throw new AppError('Barber shop not found', 404);
		}

		await this.barberShopRepository.delete(id);
	}
}
