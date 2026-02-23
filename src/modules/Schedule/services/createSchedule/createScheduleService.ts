import type { IBarberAvailabilityRepository } from '@modules/Barber/repositories/IBarberAvailabilityRepository';
import type { IBarberBlockRepository } from '@modules/Barber/repositories/IBarberBlockRepository';
import type { ICreateScheduleBodyDTO } from '@modules/Schedule/dtos/ICreateScheduleDTO';
import type { IScheduleRepository } from '@modules/Schedule/repositories/IScheduleRepository';
import type { IServiceRepository } from '@modules/Service/repositories/IServiceRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

interface IRequest extends ICreateScheduleBodyDTO {
	barberShopId: string;
	clientId: string;
}

const WEEK_DAYS = [
	'SUNDAY',
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
] as const;

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
		@inject('BarberAvailabilityRepository')
		private barberAvailabilityRepository: IBarberAvailabilityRepository,
		@inject('BarberBlockRepository')
		private barberBlockRepository: IBarberBlockRepository,
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

		// Validate barber availability for the given week day
		const dayOfWeek = WEEK_DAYS[new Date(date).getUTCDay()];

		const availability =
			await this.barberAvailabilityRepository.findByBarberIdAndWeekDay(
				barberId,
				dayOfWeek,
			);

		if (!availability) {
			throw new AppError('Barber is not available on this day', 400);
		}

		if (startTime < availability.startTime || endTime > availability.endTime) {
			throw new AppError('Schedule is outside barber working hours', 400);
		}

		// Check for barber blocks on that date/time
		const block = await this.barberBlockRepository.findByBarberIdAndDateRange(
			barberId,
			date,
			startTime,
			endTime,
		);

		if (block) {
			throw new AppError('Barber has blocked this time slot', 409);
		}

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
