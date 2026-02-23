import type { IScheduleRepository } from '@modules/Schedule/repositories/IScheduleRepository';
import type { IUpdateScheduleStatusDTO } from '@modules/Schedule/dtos/IUpdateScheduleStatusDTO';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UpdateScheduleStatusService {
	constructor(
		@inject('ScheduleRepository')
		private scheduleRepository: IScheduleRepository,
	) {}

	async execute({ id, status }: IUpdateScheduleStatusDTO): Promise<void> {
		const schedule = await this.scheduleRepository.findById(id);

		if (!schedule) {
			throw new AppError('Schedule not found', 404);
		}

		if (schedule.status === 'CANCELED') {
			throw new AppError('Cannot update a canceled schedule', 400);
		}

		if (schedule.status === 'COMPLETED') {
			throw new AppError('Cannot update a completed schedule', 400);
		}

		await this.scheduleRepository.updateStatus({ id, status });
	}
}
