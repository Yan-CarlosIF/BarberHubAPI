import 'reflect-metadata';

import { BarberShopRepositoryInMemory } from '@modules/BarberShop/repositories/inMemory/barberShopRepositoryInMemory';
import { ServiceRepositoryInMemory } from '@modules/Service/repositories/inMemory/ServiceRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { ListServicesService } from './listServices.service';

describe('ListServicesService', () => {
	let listServicesService: ListServicesService;
	let serviceRepositoryInMemory: ServiceRepositoryInMemory;
	let barberShopRepositoryInMemory: BarberShopRepositoryInMemory;

	beforeAll(() => {
		serviceRepositoryInMemory = new ServiceRepositoryInMemory();
		barberShopRepositoryInMemory = new BarberShopRepositoryInMemory();
		listServicesService = new ListServicesService(
			serviceRepositoryInMemory,
			barberShopRepositoryInMemory,
		);
	});

	it('should be able to list services by barber shop', async () => {
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

		await serviceRepositoryInMemory.create({
			barberShopId: barberShop.id,
			name: 'Corte de cabelo',
			price: 50,
			durationInMinutes: 30,
			description: 'Corte masculino',
		});

		await serviceRepositoryInMemory.create({
			barberShopId: barberShop.id,
			name: 'Barba',
			price: 30,
			durationInMinutes: 20,
			description: 'Barba completa',
		});

		const services = await listServicesService.execute(barberShop.id);

		expect(services).toHaveLength(2);
	});

	it('should not be able to list services for a non-existing barber shop', async () => {
		await expect(
			listServicesService.execute('non-existing-barberShopId'),
		).rejects.toEqual(new AppError('Barber shop not found', 404));
	});
});
