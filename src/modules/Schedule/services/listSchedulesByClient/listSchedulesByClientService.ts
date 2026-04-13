import type { Schedule } from '@modules/Schedule/infra/prisma/entities/Schedule';
import type { IScheduleRepository } from '@modules/Schedule/repositories/IScheduleRepository';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListSchedulesByClientService {
	constructor(
		@inject('ScheduleRepository')
		private scheduleRepository: IScheduleRepository,
		@inject('UserRepository')
		private userRepository: IUserRepository,
	) {}

	async execute(userId: string): Promise<Schedule[]> {
		const client = await this.userRepository.findClientByUserId(userId);

		if (!client) {
			throw new AppError('Client profile not found', 404);
		}

		return this.scheduleRepository.findAllByClientId(client.id);
	}
}
