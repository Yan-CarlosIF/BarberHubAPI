import type { ICreateScheduleDTO } from '@modules/Schedule/dtos/ICreateScheduleDTO';
import type { IUpdateScheduleStatusDTO } from '@modules/Schedule/dtos/IUpdateScheduleStatusDTO';
import { Schedule } from '@modules/Schedule/infra/prisma/entities/Schedule';
import type { IScheduleRepository } from '../IScheduleRepository';

export class ScheduleRepositoryInMemory implements IScheduleRepository {
	schedules: Schedule[] = [];

	async create({
		barberShopId,
		clientId,
		barberId,
		serviceId,
		date,
		startTime,
		endTime,
	}: ICreateScheduleDTO): Promise<void> {
		const schedule = new Schedule({
			barberShopId,
			clientId,
			barberId,
			serviceId,
			date: new Date(date),
			startTime,
			endTime,
			status: 'SCHEDULED',
		});

		this.schedules.push(schedule);
	}

	async findById(id: string): Promise<Schedule | null> {
		return this.schedules.find((schedule) => schedule.id === id) ?? null;
	}

	async findByBarberAndDateRange(
		barberId: string,
		date: string,
		startTime: string,
		endTime: string,
	): Promise<Schedule | null> {
		return (
			this.schedules.find(
				(schedule) =>
					schedule.barberId === barberId &&
					schedule.date.toISOString().slice(0, 10) === date &&
					schedule.status !== 'CANCELED' &&
					schedule.startTime < endTime &&
					schedule.endTime > startTime,
			) ?? null
		);
	}

	async findAllByBarberShopId(barberShopId: string): Promise<Schedule[]> {
		return this.schedules.filter(
			(schedule) => schedule.barberShopId === barberShopId,
		);
	}

	async findAllByClientId(clientId: string): Promise<Schedule[]> {
		return this.schedules.filter(
			(schedule) => schedule.clientId === clientId,
		);
	}

	async findAllByBarberId(barberId: string): Promise<Schedule[]> {
		return this.schedules.filter(
			(schedule) => schedule.barberId === barberId,
		);
	}

	async findAllByBarberIdAndDate(
		barberId: string,
		date: string,
	): Promise<Schedule[]> {
		return this.schedules.filter(
			(schedule) =>
				schedule.barberId === barberId &&
				schedule.date.toISOString().slice(0, 10) === date,
		);
	}

	async updateStatus({ id, status }: IUpdateScheduleStatusDTO): Promise<void> {
		const index = this.schedules.findIndex((schedule) => schedule.id === id);

		if (index === -1) {
			throw new Error('Schedule not found');
		}

		this.schedules[index] = {
			...this.schedules[index],
			status,
			updatedAt: new Date(),
		};
	}

	async delete(id: string): Promise<void> {
		const index = this.schedules.findIndex((schedule) => schedule.id === id);

		if (index === -1) {
			throw new Error('Schedule not found');
		}

		this.schedules.splice(index, 1);
	}
}
