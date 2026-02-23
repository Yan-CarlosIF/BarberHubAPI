import 'reflect-metadata';

import { BarberServiceRepositoryInMemory } from '@modules/Barber/repositories/inMemory/BarberServiceRepositoryInMemory';
import { ServiceRepositoryInMemory } from '@modules/Service/repositories/inMemory/ServiceRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { AssignBarberServiceService } from './assignBarberServiceService';

describe('AssignBarberServiceService', () => {
	let barberServiceRepositoryInMemory: BarberServiceRepositoryInMemory;
	let serviceRepositoryInMemory: ServiceRepositoryInMemory;
	let assignBarberServiceService: AssignBarberServiceService;

	beforeEach(() => {
		barberServiceRepositoryInMemory = new BarberServiceRepositoryInMemory();
		serviceRepositoryInMemory = new ServiceRepositoryInMemory();
		assignBarberServiceService = new AssignBarberServiceService(
			barberServiceRepositoryInMemory,
			serviceRepositoryInMemory,
		);
	});

	it('should be able to assign a service to a barber', async () => {
		await serviceRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			name: 'Corte de cabelo',
			price: 30,
			durationInMinutes: 30,
		});

		const service = serviceRepositoryInMemory.services[0];

		await assignBarberServiceService.execute({
			barberId: 'barberId',
			serviceId: service.id,
		});

		expect(barberServiceRepositoryInMemory.barberServices).toHaveLength(1);
	});

	it('should not assign a non-existing service', async () => {
		await expect(
			assignBarberServiceService.execute({
				barberId: 'barberId',
				serviceId: 'non-existing-id',
			}),
		).rejects.toEqual(new AppError('Service not found', 404));
	});

	it('should not assign the same service twice', async () => {
		await serviceRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			name: 'Corte de cabelo',
			price: 30,
			durationInMinutes: 30,
		});

		const service = serviceRepositoryInMemory.services[0];

		await assignBarberServiceService.execute({
			barberId: 'barberId',
			serviceId: service.id,
		});

		await expect(
			assignBarberServiceService.execute({
				barberId: 'barberId',
				serviceId: service.id,
			}),
		).rejects.toEqual(
			new AppError('This service is already assigned to this barber', 409),
		);
	});
});
