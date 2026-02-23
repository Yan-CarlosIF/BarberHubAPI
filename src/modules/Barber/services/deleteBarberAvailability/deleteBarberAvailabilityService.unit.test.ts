import 'reflect-metadata';

import { BarberAvailabilityRepositoryInMemory } from '@modules/Barber/repositories/inMemory/BarberAvailabilityRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { DeleteBarberAvailabilityService } from './deleteBarberAvailabilityService';

describe('DeleteBarberAvailabilityService', () => {
	let barberAvailabilityRepositoryInMemory: BarberAvailabilityRepositoryInMemory;
	let deleteBarberAvailabilityService: DeleteBarberAvailabilityService;

	beforeEach(() => {
		barberAvailabilityRepositoryInMemory =
			new BarberAvailabilityRepositoryInMemory();
		deleteBarberAvailabilityService = new DeleteBarberAvailabilityService(
			barberAvailabilityRepositoryInMemory,
		);
	});

	it('should delete all availability for a barber', async () => {
		await barberAvailabilityRepositoryInMemory.create({
			barberId: 'barberId',
			weekDay: 'MONDAY',
			startTime: '09:00',
			endTime: '18:00',
		});

		await barberAvailabilityRepositoryInMemory.create({
			barberId: 'barberId',
			weekDay: 'TUESDAY',
			startTime: '09:00',
			endTime: '18:00',
		});

		await deleteBarberAvailabilityService.execute('barberId');

		expect(barberAvailabilityRepositoryInMemory.availabilities).toHaveLength(0);
	});

	it('should not delete availability for a barber without any availability', async () => {
		await expect(
			deleteBarberAvailabilityService.execute('barberId'),
		).rejects.toEqual(
			new AppError('No availability found for this barber', 404),
		);
	});
});
