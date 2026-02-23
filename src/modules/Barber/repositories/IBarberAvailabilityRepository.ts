import type { ICreateBarberAvailabilityDTO } from '../dtos/ICreateBarberAvailabilityDTO';
import type { BarberAvailability } from '../infra/prisma/entities/BarberAvailability';

export interface IBarberAvailabilityRepository {
	create(data: ICreateBarberAvailabilityDTO): Promise<void>;
	findAllByBarberId(barberId: string): Promise<BarberAvailability[]>;
	findByBarberIdAndWeekDay(
		barberId: string,
		weekDay: string,
	): Promise<BarberAvailability | null>;
	delete(id: string): Promise<void>;
	deleteAllByBarberId(barberId: string): Promise<void>;
}
