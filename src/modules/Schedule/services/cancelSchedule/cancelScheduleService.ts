import type { IScheduleRepository } from '@modules/Schedule/repositories/IScheduleRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CancelScheduleService {
	constructor(
		@inject('ScheduleRepository')
		private scheduleRepository: IScheduleRepository,
	) {}

	async execute(id: string): Promise<void> {
		const schedule = await this.scheduleRepository.findById(id);

		if (!schedule) {
			throw new AppError('Schedule not found', 404);
		}

		if (schedule.status === 'CANCELED') {
			throw new AppError('Schedule is already canceled', 400);
		}

		if (schedule.status === 'COMPLETED') {
			throw new AppError('Cannot cancel a completed schedule', 400);
		}

		await this.scheduleRepository.updateStatus({
			id,
			status: 'CANCELED',
		});
	}
}
