import 'reflect-metadata';

import { BarberShopRepositoryInMemory } from '@modules/BarberShop/repositories/inMemory/barberShopRepositoryInMemory';
import { UserRepositoryInMemory } from '@modules/User/repositories/inMemory/userRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { ListBarbersService } from './listBarbersService';

describe('ListBarbersService', () => {
	let listBabersService: ListBarbersService;
	let userRepositoryInMemory: UserRepositoryInMemory;
	let barberShopRepositoryInMemory: BarberShopRepositoryInMemory;

	beforeAll(() => {
		barberShopRepositoryInMemory = new BarberShopRepositoryInMemory();
		userRepositoryInMemory = new UserRepositoryInMemory();
		listBabersService = new ListBarbersService(
			userRepositoryInMemory,
			barberShopRepositoryInMemory,
		);
	});

	it('should be able to list barbers by barbershop', async () => {
		await barberShopRepositoryInMemory.create({
			name: 'Barber Shop',
			slug: 'barber-shop',
			cep: '12345678',
			city: 'City',
			description: 'Description',
			email: 'barbershop@example.com',
			phone: '123456789',
			state: 'State',
			street: 'Street',
		});

		const barberShop = await barberShopRepositoryInMemory.findByEmail(
			'barbershop@example.com',
		);

		if (!barberShop) {
			throw new Error('BarberShop not found');
		}

		await userRepositoryInMemory.createBarber({
			name: 'Barber 1',
			email: 'barber1@example.com',
			password: '123456',
			barberShopId: barberShop.id,
			isActive: true,
			specialty: 'Beard',
		});

		await userRepositoryInMemory.createBarber({
			name: 'Barber 2',
			email: 'barber2@example.com',
			password: '123456',
			barberShopId: barberShop.id,
			isActive: true,
			specialty: 'Haircut',
		});

		await expect(
			listBabersService.execute(barberShop.id),
		).resolves.toHaveLength(2);
	});

	it('should not be able to list barbers for a non-existing barbershop', async () => {
		await expect(
			listBabersService.execute('non-existing-barberShopId'),
		).rejects.toEqual(new AppError('BarberShop not found', 404));
	});
});
