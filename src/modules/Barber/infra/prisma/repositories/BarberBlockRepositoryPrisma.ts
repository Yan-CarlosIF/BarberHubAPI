import type { ICreateBarberBlockDTO } from '@modules/Barber/dtos/ICreateBarberBlockDTO';
import type { IBarberBlockRepository } from '@modules/Barber/repositories/IBarberBlockRepository';
import { prisma } from '@shared/infra/prisma/client';
import type { BarberBlock } from '../entities/BarberBlock';

export class BarberBlockRepositoryPrisma implements IBarberBlockRepository {
	async create({
		barberId,
		date,
		startTime,
		endTime,
	}: ICreateBarberBlockDTO): Promise<void> {
		await prisma.barberBlock.create({
			data: {
				barberId,
				date: new Date(date),
				startTime,
				endTime,
			},
		});
	}

	async findAllByBarberId(barberId: string): Promise<BarberBlock[]> {
		return await prisma.barberBlock.findMany({
			where: { barberId },
			orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
		});
	}

	async findByBarberIdAndDateRange(
		barberId: string,
		date: string,
		startTime: string,
		endTime: string,
	): Promise<BarberBlock | null> {
		return await prisma.barberBlock.findFirst({
			where: {
				barberId,
				date: new Date(date),
				startTime: { lt: endTime },
				endTime: { gt: startTime },
			},
		});
	}

	async delete(id: string): Promise<void> {
		await prisma.barberBlock.delete({
			where: { id },
		});
	}
}
