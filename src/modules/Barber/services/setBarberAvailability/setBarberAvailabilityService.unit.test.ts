import 'reflect-metadata';

import { BarberAvailabilityRepositoryInMemory } from '@modules/Barber/repositories/inMemory/BarberAvailabilityRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { SetBarberAvailabilityService } from './setBarberAvailabilityService';

describe('SetBarberAvailabilityService', () => {
	let barberAvailabilityRepositoryInMemory: BarberAvailabilityRepositoryInMemory;
	let setBarberAvailabilityService: SetBarberAvailabilityService;

	beforeEach(() => {
		barberAvailabilityRepositoryInMemory =
			new BarberAvailabilityRepositoryInMemory();
		setBarberAvailabilityService = new SetBarberAvailabilityService(
			barberAvailabilityRepositoryInMemory,
		);
	});

	it('should be able to set barber availability for a week day', async () => {
		await setBarberAvailabilityService.execute({
			barberId: 'barberId',
			weekDay: 'MONDAY',
			startTime: '09:00',
			endTime: '18:00',
		});

		expect(barberAvailabilityRepositoryInMemory.availabilities).toHaveLength(1);
		expect(barberAvailabilityRepositoryInMemory.availabilities[0].weekDay).toBe(
			'MONDAY',
		);
	});

	it('should replace existing availability for the same week day', async () => {
		await setBarberAvailabilityService.execute({
			barberId: 'barberId',
			weekDay: 'MONDAY',
			startTime: '09:00',
			endTime: '18:00',
		});

		await setBarberAvailabilityService.execute({
			barberId: 'barberId',
			weekDay: 'MONDAY',
			startTime: '10:00',
			endTime: '19:00',
		});

		expect(barberAvailabilityRepositoryInMemory.availabilities).toHaveLength(1);
		expect(
			barberAvailabilityRepositoryInMemory.availabilities[0].startTime,
		).toBe('10:00');
	});

	it('should not set availability when start time is after end time', async () => {
		await expect(
			setBarberAvailabilityService.execute({
				barberId: 'barberId',
				weekDay: 'MONDAY',
				startTime: '18:00',
				endTime: '09:00',
			}),
		).rejects.toEqual(new AppError('Start time must be before end time', 400));
	});
});
