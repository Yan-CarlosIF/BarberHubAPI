import type {
	BarberShopOpeningHours,
	BarberShop as IBarberShop,
} from '@prisma/client';

export class BarberShop implements IBarberShop {
	id: string = crypto.randomUUID();
	email: string;
	name: string;
	description: string;
	phone: string;
	city: string;
	street: string;
	state: string;
	cep: string;
	createdAt: Date = new Date();

	BarberShopOpeningHours?: BarberShopOpeningHours[];

	constructor({
		cep,
		city,
		description,
		email,
		name,
		phone,
		state,
		street,
	}: Omit<IBarberShop, 'id' | 'createdAt'>) {
		this.cep = cep;
		this.city = city;
		this.description = description;
		this.email = email;
		this.name = name;
		this.phone = phone;
		this.state = state;
		this.street = street;
	}
}
