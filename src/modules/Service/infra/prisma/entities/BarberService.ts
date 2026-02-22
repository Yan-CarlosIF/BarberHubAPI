import type { BarberService as IBarberService } from '@prisma/client';

export class BarberService implements IBarberService {
	id: string;
	barberId: string;
	serviceId: string;

	constructor({
		id,
		barberId,
		serviceId,
	}: Omit<IBarberService, 'id'> & { id?: string }) {
		this.id = id ?? crypto.randomUUID();
		this.barberId = barberId;
		this.serviceId = serviceId;
	}
}
