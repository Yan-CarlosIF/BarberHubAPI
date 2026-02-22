import 'reflect-metadata';

import { ServiceRepositoryInMemory } from '@modules/Service/repositories/inMemory/ServiceRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { DeleteServiceService } from './deleteService.service';

describe('DeleteServiceService', () => {
	let deleteServiceService: DeleteServiceService;
	let serviceRepositoryInMemory: ServiceRepositoryInMemory;

	beforeEach(() => {
		serviceRepositoryInMemory = new ServiceRepositoryInMemory();
		deleteServiceService = new DeleteServiceService(serviceRepositoryInMemory);
	});

	it('should be able to delete a service', async () => {
		await serviceRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			name: 'Corte de cabelo',
			price: 50,
			durationInMinutes: 30,
			description: 'Corte masculino',
		});

		const service = serviceRepositoryInMemory.services[0];

		await deleteServiceService.execute(service.id);

		expect(serviceRepositoryInMemory.services).toHaveLength(0);
	});

	it('should not be able to delete a non-existing service', async () => {
		await expect(
			deleteServiceService.execute('non-existing-id'),
		).rejects.toEqual(new AppError('Service not found', 404));
	});
});
