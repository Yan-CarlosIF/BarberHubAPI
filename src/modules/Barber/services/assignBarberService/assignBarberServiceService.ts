import type { IBarberServiceRepository } from '@modules/Barber/repositories/IBarberServiceRepository';
import type { IServiceRepository } from '@modules/Service/repositories/IServiceRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';
import type { IAssignBarberServiceDTO } from '../../dtos/IAssignBarberServiceDTO';

interface IRequest extends IAssignBarberServiceDTO {
	barberId: string;
}

@injectable()
export class AssignBarberServiceService {
	constructor(
		@inject('BarberServiceRepository')
		private barberServiceRepository: IBarberServiceRepository,
		@inject('ServiceRepository')
		private serviceRepository: IServiceRepository,
	) {}

	async execute({ barberId, serviceId }: IRequest) {
		const service = await this.serviceRepository.findById(serviceId);

		if (!service) {
			throw new AppError('Service not found', 404);
		}

		const alreadyAssigned =
			await this.barberServiceRepository.findByBarberIdAndServiceId(
				barberId,
				serviceId,
			);

		if (alreadyAssigned) {
			throw new AppError(
				'This service is already assigned to this barber',
				409,
			);
		}

		await this.barberServiceRepository.assign({ barberId, serviceId });
	}
}
