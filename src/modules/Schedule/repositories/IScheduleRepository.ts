import type { ICreateScheduleDTO } from '../dtos/ICreateScheduleDTO';
import type { IUpdateScheduleStatusDTO } from '../dtos/IUpdateScheduleStatusDTO';
import type { Schedule } from '../infra/prisma/entities/Schedule';

export interface IScheduleRepository {
	create(data: ICreateScheduleDTO): Promise<void>;
	findById(id: string): Promise<Schedule | null>;
	findByBarberAndDateRange(
		barberId: string,
		date: string,
		startTime: string,
		endTime: string,
	): Promise<Schedule | null>;
	findAllByBarberShopId(barberShopId: string): Promise<Schedule[]>;
	findAllByClientId(clientId: string): Promise<Schedule[]>;
	findAllByBarberId(barberId: string): Promise<Schedule[]>;
	findAllByBarberIdAndDate(barberId: string, date: string): Promise<Schedule[]>;
	updateStatus(data: IUpdateScheduleStatusDTO): Promise<void>;
	delete(id: string): Promise<void>;
}
