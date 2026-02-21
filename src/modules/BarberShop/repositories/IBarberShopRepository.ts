import type { ICreateBarberShopDTO } from '../dtos/IcreateBarberShopDTO';
import type { BarberShop } from '../infra/prisma/entities/BarberShop';

export interface IBarberShopRepository {
	create(data: ICreateBarberShopDTO): Promise<void>;
	list(): Promise<BarberShop[]>;
	delete(id: string): Promise<void>;
	findById(id: string): Promise<BarberShop | null>;
	findByPhone(phone: string): Promise<BarberShop | null>;
	findByEmail(email: string): Promise<BarberShop | null>;
	findBySlug(slug: string): Promise<BarberShop | null>;
}
