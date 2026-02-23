import 'reflect-metadata';

import { ServiceRepositoryInMemory } from '@modules/Service/repositories/inMemory/ServiceRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { UpdateServiceService } from './updateService.service';

describe('UpdateServiceService', () => {
	let updateServiceService: UpdateServiceService;
	let serviceRepositoryInMemory: ServiceRepositoryInMemory;

	beforeEach(() => {
		serviceRepositoryInMemory = new ServiceRepositoryInMemory();
		updateServiceService = new UpdateServiceService(serviceRepositoryInMemory);
	});

	it('should be able to update a service', async () => {
		await serviceRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			name: 'Corte de cabelo',
			price: 50,
			durationInMinutes: 30,
			description: 'Corte masculino',
		});

		const service = serviceRepositoryInMemory.services[0];

		await updateServiceService.execute(service.id, {
			name: 'Corte atualizado',
			price: 60,
		});

		const updatedService = await serviceRepositoryInMemory.findById(service.id);

		expect(updatedService?.name).toBe('Corte atualizado');
		expect(updatedService?.price.toNumber()).toBe(60);
	});

	it('should not be able to update a non-existing service', async () => {
		await expect(
			updateServiceService.execute('non-existing-id', {
				name: 'updated',
			}),
		).rejects.toEqual(new AppError('Service not found', 404));
	});
});
