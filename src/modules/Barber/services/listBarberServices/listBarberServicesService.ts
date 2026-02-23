import type { IBarberServiceRepository } from '@modules/Barber/repositories/IBarberServiceRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListBarberServicesService {
	constructor(
		@inject('BarberServiceRepository')
		private barberServiceRepository: IBarberServiceRepository,
	) {}

	async execute(barberId: string) {
		return await this.barberServiceRepository.findAllByBarberId(barberId);
	}
}
