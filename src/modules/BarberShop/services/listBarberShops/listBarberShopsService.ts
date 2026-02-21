import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListBarberShopsService {
	constructor(
		@inject('BarberShopRepository')
		private barberShopRepository: IBarberShopRepository,
	) {}

	async execute() {
		const barberShops = await this.barberShopRepository.list();

		return barberShops;
	}
}
