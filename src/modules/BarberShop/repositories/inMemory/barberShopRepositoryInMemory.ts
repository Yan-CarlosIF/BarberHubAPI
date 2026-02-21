import type { ICreateBarberShopDTO } from '@modules/BarberShop/dtos/IcreateBarberShopDTO';
import { BarberShop } from '@modules/BarberShop/infra/prisma/entities/BarberShop';
import type { IBarberShopRepository } from '../IBarberShopRepository';

export class BarberShopRepositoryInMemory implements IBarberShopRepository {
	public barberShops: BarberShop[] = [];

	async create(data: ICreateBarberShopDTO): Promise<void> {
		const barberShop = new BarberShop(data);

		this.barberShops.push(barberShop);
	}

	async list(): Promise<BarberShop[]> {
		return this.barberShops;
	}

	async delete(id: string): Promise<void> {
		const barberShopIndex = this.barberShops.findIndex(
			(barberShop) => barberShop.id === id,
		);

		if (barberShopIndex === -1) {
			throw new Error('BarberShop not found');
		}

		this.barberShops.splice(barberShopIndex, 1);
	}

	async findById(id: string): Promise<BarberShop | null> {
		const barberShop = this.barberShops.find(
			(barberShop) => barberShop.id === id,
		);

		return barberShop ?? null;
	}

	async findByPhone(phone: string): Promise<BarberShop | null> {
		const barberShop = this.barberShops.find(
			(barberShop) => barberShop.phone === phone,
		);

		return barberShop ?? null;
	}

	async findByEmail(email: string): Promise<BarberShop | null> {
		const barberShop = this.barberShops.find(
			(barberShop) => barberShop.email === email,
		);

		return barberShop ?? null;
	}

	async findBySlug(slug: string): Promise<BarberShop | null> {
		return (
			this.barberShops.find((barberShop) => barberShop.slug === slug) ?? null
		);
	}
}
