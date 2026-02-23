import type { IBarberAvailabilityRepository } from '@modules/Barber/repositories/IBarberAvailabilityRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListBarberAvailabilityService {
	constructor(
		@inject('BarberAvailabilityRepository')
		private barberAvailabilityRepository: IBarberAvailabilityRepository,
	) {}

	async execute(barberId: string) {
		return await this.barberAvailabilityRepository.findAllByBarberId(barberId);
	}
}
