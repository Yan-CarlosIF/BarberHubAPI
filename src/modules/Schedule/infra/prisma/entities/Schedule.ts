import type {
	Schedule as ISchedule,
	$Enums,
} from '@prisma/client';

export class Schedule implements ISchedule {
	id: string;
	barberShopId: string;
	clientId: string;
	barberId: string;
	serviceId: string;
	date: Date;
	startTime: string;
	endTime: string;
	status: $Enums.ScheduleStatus;
	createdAt: Date;
	updatedAt: Date;

	constructor({
		barberShopId,
		clientId,
		barberId,
		serviceId,
		date,
		startTime,
		endTime,
		status,
		id,
	}: Omit<ISchedule, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) {
		this.id = id ?? crypto.randomUUID();
		this.barberShopId = barberShopId;
		this.clientId = clientId;
		this.barberId = barberId;
		this.serviceId = serviceId;
		this.date = date;
		this.startTime = startTime;
		this.endTime = endTime;
		this.status = status ?? 'SCHEDULED';
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}
}
