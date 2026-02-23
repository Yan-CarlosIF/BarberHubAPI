import type { IBarberBlockRepository } from '@modules/Barber/repositories/IBarberBlockRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListBarberBlocksService {
	constructor(
		@inject('BarberBlockRepository')
		private barberBlockRepository: IBarberBlockRepository,
	) {}

	async execute(barberId: string) {
		return await this.barberBlockRepository.findAllByBarberId(barberId);
	}
}
