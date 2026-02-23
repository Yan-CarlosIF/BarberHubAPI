import type { BarberBlock as IBarberBlock } from '@prisma/client';

export class BarberBlock implements IBarberBlock {
	id: string;
	barberId: string;
	date: Date;
	startTime: string;
	endTime: string;

	constructor({
		barberId,
		date,
		startTime,
		endTime,
		id,
	}: Omit<IBarberBlock, 'id'> & { id?: string }) {
		this.id = id ?? crypto.randomUUID();
		this.barberId = barberId;
		this.date = date;
		this.startTime = startTime;
		this.endTime = endTime;
	}
}
