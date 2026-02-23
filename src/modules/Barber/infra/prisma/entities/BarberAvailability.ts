import type {
	$Enums,
	BarberAvailability as IBarberAvailability,
} from '@prisma/client';

export class BarberAvailability implements IBarberAvailability {
	id: string;
	barberId: string;
	weekDay: $Enums.WeekDay;
	startTime: string;
	endTime: string;

	constructor({
		barberId,
		weekDay,
		startTime,
		endTime,
		id,
	}: Omit<IBarberAvailability, 'id'> & { id?: string }) {
		this.id = id ?? crypto.randomUUID();
		this.barberId = barberId;
		this.weekDay = weekDay;
		this.startTime = startTime;
		this.endTime = endTime;
	}
}
