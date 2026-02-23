import type { Service as IService } from '@prisma/client';
import type { Decimal } from '@prisma/client/runtime/client';

export class Service implements IService {
	id: string;
	barberShopId: string;
	name: string;
	description: string | null;
	price: Decimal;
	durationInMinutes: number;
	isActive: boolean;
	createdAt: Date = new Date();

	constructor({
		id,
		barberShopId,
		name,
		description,
		price,
		durationInMinutes,
		isActive,
	}: Omit<IService, 'id' | 'createdAt'> & { id?: string }) {
		this.id = id ?? crypto.randomUUID();
		this.barberShopId = barberShopId;
		this.name = name;
		this.description = description ?? null;
		this.price = price;
		this.durationInMinutes = durationInMinutes;
		this.isActive = isActive ?? true;
	}
}
