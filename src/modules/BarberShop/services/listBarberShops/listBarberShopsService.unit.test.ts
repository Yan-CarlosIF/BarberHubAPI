import 'reflect-metadata';

import { BarberShopRepositoryInMemory } from '@modules/BarberShop/repositories/inMemory/barberShopRepositoryInMemory';
import { ListBarberShopsService } from './listBarberShopsService';

describe('ListBarberShopsService', () => {
	let listBarberShopsService: ListBarberShopsService;
	let barberShopRepository: BarberShopRepositoryInMemory;

	beforeEach(() => {
		barberShopRepository = new BarberShopRepositoryInMemory();
		listBarberShopsService = new ListBarberShopsService(barberShopRepository);
	});

	it('should be able to list all barber shops', async () => {
		const barberShop1 = {
			name: 'Barber Shop 1',
			slug: 'barber-shop-1',
			email: 'barbershop1@example.com',
			phone: '1234567890',
			city: 'City 1',
			street: 'Street 1',
			state: 'State 1',
			cep: '12345678',
			description: 'Description 1',
		};

		const barberShop2 = {
			name: 'Barber Shop 2',
			slug: 'barber-shop-2',
			email: 'barbershop2@example.com',
			phone: '0987654321',
			city: 'City 2',
			street: 'Street 2',
			state: 'State 2',
			cep: '87654321',
			description: 'Description 2',
		};

		await barberShopRepository.create(barberShop1);
		await barberShopRepository.create(barberShop2);

		const barberShops = await listBarberShopsService.execute();

		expect(barberShops).toHaveLength(2);
		expect(barberShops[0]).toEqual({
			id: expect.any(String),
			...barberShop1,
			createdAt: expect.any(Date),
			BarberShopOpeningHours: undefined,
		});
		expect(barberShops[1]).toEqual({
			id: expect.any(String),
			...barberShop2,
			createdAt: expect.any(Date),
			BarberShopOpeningHours: undefined,
		});
	});
});
