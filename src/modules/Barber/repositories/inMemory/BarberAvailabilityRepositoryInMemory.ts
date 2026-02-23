import type { ICreateBarberAvailabilityDTO } from '@modules/Barber/dtos/ICreateBarberAvailabilityDTO';
import { BarberAvailability } from '@modules/Barber/infra/prisma/entities/BarberAvailability';
import type { $Enums } from '@prisma/client';
import type { IBarberAvailabilityRepository } from '../IBarberAvailabilityRepository';

export class BarberAvailabilityRepositoryInMemory
	implements IBarberAvailabilityRepository
{
	availabilities: BarberAvailability[] = [];

	async create({
		barberId,
		weekDay,
		startTime,
		endTime,
	}: ICreateBarberAvailabilityDTO): Promise<void> {
		const availability = new BarberAvailability({
			barberId,
			weekDay: weekDay as $Enums.WeekDay,
			startTime,
			endTime,
		});

		this.availabilities.push(availability);
	}

	async findAllByBarberId(barberId: string): Promise<BarberAvailability[]> {
		return this.availabilities.filter((a) => a.barberId === barberId);
	}

	async findByBarberIdAndWeekDay(
		barberId: string,
		weekDay: string,
	): Promise<BarberAvailability | null> {
		return (
			this.availabilities.find(
				(a) => a.barberId === barberId && a.weekDay === weekDay,
			) ?? null
		);
	}

	async delete(id: string): Promise<void> {
		const index = this.availabilities.findIndex((a) => a.id === id);
		if (index === -1) throw new Error('Availability not found');
		this.availabilities.splice(index, 1);
	}

	async deleteAllByBarberId(barberId: string): Promise<void> {
		this.availabilities = this.availabilities.filter(
			(a) => a.barberId !== barberId,
		);
	}
}
