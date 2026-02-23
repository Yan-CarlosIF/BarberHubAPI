import type { IBarberBlockRepository } from '@modules/Barber/repositories/IBarberBlockRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';
import type { ICreateBarberBlockDTO } from '../../dtos/ICreateBarberBlockDTO';

interface IRequest extends ICreateBarberBlockDTO {
	barberId: string;
}

@injectable()
export class CreateBarberBlockService {
	constructor(
		@inject('BarberBlockRepository')
		private barberBlockRepository: IBarberBlockRepository,
	) {}

	async execute({ barberId, date, startTime, endTime }: IRequest) {
		if (startTime >= endTime) {
			throw new AppError('Start time must be before end time', 400);
		}

		const overlapping =
			await this.barberBlockRepository.findByBarberIdAndDateRange(
				barberId,
				date,
				startTime,
				endTime,
			);

		if (overlapping) {
			throw new AppError(
				'There is already a block overlapping this time range',
				409,
			);
		}

		await this.barberBlockRepository.create({
			barberId,
			date,
			startTime,
			endTime,
		});
	}
}
