import type { IBarberAvailabilityRepository } from '@modules/Barber/repositories/IBarberAvailabilityRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';
import type { ICreateBarberAvailabilityDTO } from '../../dtos/ICreateBarberAvailabilityDTO';

interface IRequest extends ICreateBarberAvailabilityDTO {
	barberId: string;
}

@injectable()
export class SetBarberAvailabilityService {
	constructor(
		@inject('BarberAvailabilityRepository')
		private barberAvailabilityRepository: IBarberAvailabilityRepository,
	) {}

	async execute({ barberId, weekDay, startTime, endTime }: IRequest) {
		if (startTime >= endTime) {
			throw new AppError('Start time must be before end time', 400);
		}

		const existing =
			await this.barberAvailabilityRepository.findByBarberIdAndWeekDay(
				barberId,
				weekDay,
			);

		if (existing) {
			await this.barberAvailabilityRepository.delete(existing.id);
		}

		await this.barberAvailabilityRepository.create({
			barberId,
			weekDay,
			startTime,
			endTime,
		});
	}
}
