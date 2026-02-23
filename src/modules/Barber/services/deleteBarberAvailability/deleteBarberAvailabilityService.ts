import type { IBarberAvailabilityRepository } from '@modules/Barber/repositories/IBarberAvailabilityRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class DeleteBarberAvailabilityService {
	constructor(
		@inject('BarberAvailabilityRepository')
		private barberAvailabilityRepository: IBarberAvailabilityRepository,
	) {}

	async execute(id: string) {
		const availabilities =
			await this.barberAvailabilityRepository.findAllByBarberId(id);

		if (availabilities.length === 0) {
			throw new AppError('No availability found for this barber', 404);
		}

		await this.barberAvailabilityRepository.deleteAllByBarberId(id);
	}
}
