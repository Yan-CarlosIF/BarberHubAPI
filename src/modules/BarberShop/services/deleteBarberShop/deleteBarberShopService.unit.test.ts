import 'reflect-metadata';

import { BarberShopRepositoryInMemory } from '@modules/BarberShop/repositories/inMemory/barberShopRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { DeleteBarberShopService } from './deleteBarberShopService';

describe('DeleteBarberShopService', () => {
	let deleteBarberShopService: DeleteBarberShopService;
	let barberShopRepositoryInMemory: BarberShopRepositoryInMemory;

	beforeEach(() => {
		barberShopRepositoryInMemory = new BarberShopRepositoryInMemory();
		deleteBarberShopService = new DeleteBarberShopService(
			barberShopRepositoryInMemory,
		);
	});

	it('should be able to delete a barber shop', async () => {
		await barberShopRepositoryInMemory.create({
			slug: 'barber-shop',
			cep: '12345-678',
			city: 'City',
			description: 'Description',
			email: 'email@example.com',
			name: 'Barber Shop',
			phone: '1234567890',
			state: 'State',
			street: 'Street',
		});

		const barberShop =
			await barberShopRepositoryInMemory.findByPhone('1234567890');

		if (!barberShop) {
			throw new Error('Barber shop not found');
		}

		await deleteBarberShopService.execute(barberShop.id);

		const deletedBarberShop = await barberShopRepositoryInMemory.findById(
			barberShop.id,
		);

		expect(deletedBarberShop).toBeNull();
	});

	it('should not be able to delete a non-existing barber shop', async () => {
		await expect(
			deleteBarberShopService.execute('non-existing-id'),
		).rejects.toEqual(new AppError('Barber shop not found', 404));
	});
});
