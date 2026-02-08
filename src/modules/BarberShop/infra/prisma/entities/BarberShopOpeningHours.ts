import type {
	BarberShopOpeningHours as IBarberShopOpeningHours,
	WeekDay,
} from '@prisma/client';

export class BarberShopOpeningHours implements IBarberShopOpeningHours {
	id: string;
	barberShopId: string;
	weekDay: WeekDay;
	openTime: string | null;
	closeTime: string | null;
	isClosed: boolean;

	constructor({
		id,
		barberShopId,
		weekDay,
		openTime,
		closeTime,
		isClosed,
	}: Omit<IBarberShopOpeningHours, 'createdAt'>) {
		this.id = id;
		this.barberShopId = barberShopId;
		this.weekDay = weekDay;
		this.openTime = openTime;
		this.closeTime = closeTime;
		this.isClosed = isClosed;
	}
}
