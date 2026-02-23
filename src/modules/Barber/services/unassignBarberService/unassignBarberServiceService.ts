import type { IBarberServiceRepository } from '@modules/Barber/repositories/IBarberServiceRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UnassignBarberServiceService {
	constructor(
		@inject('BarberServiceRepository')
		private barberServiceRepository: IBarberServiceRepository,
	) {}

	async execute(barberId: string, serviceId: string) {
		const existing =
			await this.barberServiceRepository.findByBarberIdAndServiceId(
				barberId,
				serviceId,
			);

		if (!existing) {
			throw new AppError('This service is not assigned to this barber', 404);
		}

		await this.barberServiceRepository.unassign(barberId, serviceId);
	}
}
