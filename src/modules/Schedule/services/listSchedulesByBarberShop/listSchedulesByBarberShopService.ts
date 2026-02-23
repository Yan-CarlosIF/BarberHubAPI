import type { Schedule } from '@modules/Schedule/infra/prisma/entities/Schedule';
import type { IScheduleRepository } from '@modules/Schedule/repositories/IScheduleRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListSchedulesByBarberShopService {
	constructor(
		@inject('ScheduleRepository')
		private scheduleRepository: IScheduleRepository,
	) {}

	async execute(barberShopId: string): Promise<Schedule[]> {
		return this.scheduleRepository.findAllByBarberShopId(barberShopId);
	}
}
