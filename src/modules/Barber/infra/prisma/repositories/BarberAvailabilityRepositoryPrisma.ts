import type { ICreateBarberAvailabilityDTO } from '@modules/Barber/dtos/ICreateBarberAvailabilityDTO';
import type { IBarberAvailabilityRepository } from '@modules/Barber/repositories/IBarberAvailabilityRepository';
import { $Enums } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/client';
import type { BarberAvailability } from '../entities/BarberAvailability';

export class BarberAvailabilityRepositoryPrisma
	implements IBarberAvailabilityRepository
{
	async create({
		barberId,
		weekDay,
		startTime,
		endTime,
	}: ICreateBarberAvailabilityDTO): Promise<void> {
		await prisma.barberAvailability.create({
			data: {
				barberId,
				weekDay: $Enums.WeekDay[weekDay as keyof typeof $Enums.WeekDay],
				startTime,
				endTime,
			},
		});
	}

	async findAllByBarberId(barberId: string): Promise<BarberAvailability[]> {
		return await prisma.barberAvailability.findMany({
			where: { barberId },
			orderBy: { weekDay: 'asc' },
		});
	}

	async findByBarberIdAndWeekDay(
		barberId: string,
		weekDay: string,
	): Promise<BarberAvailability | null> {
		return await prisma.barberAvailability.findFirst({
			where: {
				barberId,
				weekDay: $Enums.WeekDay[weekDay as keyof typeof $Enums.WeekDay],
			},
		});
	}

	async delete(id: string): Promise<void> {
		await prisma.barberAvailability.delete({
			where: { id },
		});
	}

	async deleteAllByBarberId(barberId: string): Promise<void> {
		await prisma.barberAvailability.deleteMany({
			where: { barberId },
		});
	}
}
