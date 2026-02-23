import type { IScheduleRepository } from '@modules/Schedule/repositories/IScheduleRepository';
import { inject, injectable } from 'tsyringe';
import type { Schedule } from '@modules/Schedule/infra/prisma/entities/Schedule';

@injectable()
export class ListSchedulesByClientService {
	constructor(
		@inject('ScheduleRepository')
		private scheduleRepository: IScheduleRepository,
	) {}

	async execute(clientId: string): Promise<Schedule[]> {
		return this.scheduleRepository.findAllByClientId(clientId);
	}
}
