import type { ICreateBarberBlockDTO } from '../dtos/ICreateBarberBlockDTO';
import type { BarberBlock } from '../infra/prisma/entities/BarberBlock';

export interface IBarberBlockRepository {
	create(data: ICreateBarberBlockDTO): Promise<void>;
	findAllByBarberId(barberId: string): Promise<BarberBlock[]>;
	findByBarberIdAndDateRange(
		barberId: string,
		date: string,
		startTime: string,
		endTime: string,
	): Promise<BarberBlock | null>;
	delete(id: string): Promise<void>;
}
