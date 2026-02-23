import type { IServiceRepository } from '@modules/Service/repositories/IServiceRepository';
import type { ICreateScheduleBodyDTO } from '@modules/Schedule/dtos/ICreateScheduleDTO';
import type { IScheduleRepository } from '@modules/Schedule/repositories/IScheduleRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

interface IRequest extends ICreateScheduleBodyDTO {
	barberShopId: string;
	clientId: string;
}

function addMinutesToTime(time: string, minutes: number): string {
	const [hours, mins] = time.split(':').map(Number);
	const totalMinutes = hours * 60 + mins + minutes;
	const newHours = Math.floor(totalMinutes / 60)
		.toString()
		.padStart(2, '0');
	const newMins = (totalMinutes % 60).toString().padStart(2, '0');
	return `${newHours}:${newMins}`;
}

@injectable()
export class CreateScheduleService {
	constructor(
		@inject('ScheduleRepository')
		private scheduleRepository: IScheduleRepository,
		@inject('ServiceRepository')
		private serviceRepository: IServiceRepository,
	) {}

	async execute({
		barberShopId,
		clientId,
		barberId,
		serviceId,
		date,
		startTime,
	}: IRequest): Promise<void> {
		const service = await this.serviceRepository.findById(serviceId);

		if (!service) {
			throw new AppError('Service not found', 404);
		}

		if (!service.isActive) {
			throw new AppError('Service is not active', 400);
		}

		const endTime = addMinutesToTime(startTime, service.durationInMinutes);

		const conflictingSchedule =
			await this.scheduleRepository.findByBarberAndDateRange(
				barberId,
				date,
				startTime,
				endTime,
			);

		if (conflictingSchedule) {
			throw new AppError(
				'This time slot is already booked for this barber',
				409,
			);
		}

		await this.scheduleRepository.create({
			barberShopId,
			clientId,
			barberId,
			serviceId,
			date,
			startTime,
			endTime,
		});
	}
}
