import type { ICreateScheduleDTO } from '@modules/Schedule/dtos/ICreateScheduleDTO';
import type { IUpdateScheduleStatusDTO } from '@modules/Schedule/dtos/IUpdateScheduleStatusDTO';
import type { IScheduleRepository } from '@modules/Schedule/repositories/IScheduleRepository';
import { $Enums } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/client';
import type { Schedule } from '../entities/Schedule';

export class ScheduleRepositoryPrisma implements IScheduleRepository {
	async create({
		barberShopId,
		clientId,
		barberId,
		serviceId,
		date,
		startTime,
		endTime,
	}: ICreateScheduleDTO): Promise<void> {
		await prisma.schedule.create({
			data: {
				barberShopId,
				clientId,
				barberId,
				serviceId,
				date: new Date(date),
				startTime,
				endTime,
				status: $Enums.ScheduleStatus.SCHEDULED,
			},
		});
	}

	async findById(id: string): Promise<Schedule | null> {
		return await prisma.schedule.findUnique({
			where: { id },
		});
	}

	async findByBarberAndDateRange(
		barberId: string,
		date: string,
		startTime: string,
		endTime: string,
	): Promise<Schedule | null> {
		return await prisma.schedule.findFirst({
			where: {
				barberId,
				date: new Date(date),
				status: { not: $Enums.ScheduleStatus.CANCELED },
				startTime: { lt: endTime },
				endTime: { gt: startTime },
			},
		});
	}

	async findAllByBarberShopId(barberShopId: string): Promise<Schedule[]> {
		return await prisma.schedule.findMany({
			where: { barberShopId },
			orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
			include: {
				client: { include: { user: true } },
				barber: { include: { user: true } },
				service: true,
			},
		});
	}

	async findAllByClientId(clientId: string): Promise<Schedule[]> {
		return await prisma.schedule.findMany({
			where: { clientId },
			orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
			include: {
				barber: { include: { user: true } },
				service: true,
				barberShop: true,
			},
		});
	}

	async findAllByBarberId(barberId: string): Promise<Schedule[]> {
		return await prisma.schedule.findMany({
			where: { barberId },
			orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
			include: {
				client: { include: { user: true } },
				service: true,
			},
		});
	}

	async findAllByBarberIdAndDate(
		barberId: string,
		date: string,
	): Promise<Schedule[]> {
		return await prisma.schedule.findMany({
			where: {
				barberId,
				date: new Date(date),
			},
			orderBy: { startTime: 'asc' },
		});
	}

	async updateStatus({ id, status }: IUpdateScheduleStatusDTO): Promise<void> {
		await prisma.schedule.update({
			where: { id },
			data: { status: $Enums.ScheduleStatus[status] },
		});
	}

	async delete(id: string): Promise<void> {
		await prisma.schedule.delete({
			where: { id },
		});
	}
}
