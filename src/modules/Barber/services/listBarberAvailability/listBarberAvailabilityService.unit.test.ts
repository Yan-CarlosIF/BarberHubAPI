import 'reflect-metadata';

import { BarberAvailabilityRepositoryInMemory } from '@modules/Barber/repositories/inMemory/BarberAvailabilityRepositoryInMemory';
import { ListBarberAvailabilityService } from './listBarberAvailabilityService';

describe('ListBarberAvailabilityService', () => {
	let barberAvailabilityRepositoryInMemory: BarberAvailabilityRepositoryInMemory;
	let listBarberAvailabilityService: ListBarberAvailabilityService;

	beforeEach(() => {
		barberAvailabilityRepositoryInMemory =
			new BarberAvailabilityRepositoryInMemory();
		listBarberAvailabilityService = new ListBarberAvailabilityService(
			barberAvailabilityRepositoryInMemory,
		);
	});

	it('should list all availability for a barber', async () => {
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

		const result = await listBarberAvailabilityService.execute('barberId');

		expect(result).toHaveLength(2);
	});

	it('should return empty array when barber has no availability', async () => {
		const result = await listBarberAvailabilityService.execute('barberId');

		expect(result).toHaveLength(0);
	});
});
