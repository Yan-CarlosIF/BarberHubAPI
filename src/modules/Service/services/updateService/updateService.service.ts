import type { IUpdateServiceDTO } from '@modules/Service/dtos/IUpdateServiceDTO';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';
import type { IServiceRepository } from '../../repositories/IServiceRepository';

@injectable()
export class UpdateServiceService {
	constructor(
		@inject('ServiceRepository')
		private serviceRepository: IServiceRepository,
	) {}

	async execute(id: string, data: IUpdateServiceDTO) {
		const serviceExists = await this.serviceRepository.findById(id);

		if (!serviceExists) {
			throw new AppError('Service not found', 404);
		}

		await this.serviceRepository.update(id, data);
	}
}
