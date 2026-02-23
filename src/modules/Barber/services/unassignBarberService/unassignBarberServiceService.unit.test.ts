import 'reflect-metadata';

import { BarberServiceRepositoryInMemory } from '@modules/Barber/repositories/inMemory/BarberServiceRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { UnassignBarberServiceService } from './unassignBarberServiceService';

describe('UnassignBarberServiceService', () => {
	let barberServiceRepositoryInMemory: BarberServiceRepositoryInMemory;
	let unassignBarberServiceService: UnassignBarberServiceService;

	beforeEach(() => {
		barberServiceRepositoryInMemory = new BarberServiceRepositoryInMemory();
		unassignBarberServiceService = new UnassignBarberServiceService(
			barberServiceRepositoryInMemory,
		);
	});

	it('should be able to unassign a service from a barber', async () => {
		await barberServiceRepositoryInMemory.assign({
			barberId: 'barberId',
			serviceId: 'serviceId',
		});

		await unassignBarberServiceService.execute('barberId', 'serviceId');

		expect(barberServiceRepositoryInMemory.barberServices).toHaveLength(0);
	});

	it('should not unassign a service that is not assigned', async () => {
		await expect(
			unassignBarberServiceService.execute('barberId', 'serviceId'),
		).rejects.toEqual(
			new AppError('This service is not assigned to this barber', 404),
		);
	});
});
