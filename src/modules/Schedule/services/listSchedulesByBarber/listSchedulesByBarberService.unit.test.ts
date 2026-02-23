import 'reflect-metadata';

import { ScheduleRepositoryInMemory } from '@modules/Schedule/repositories/inMemory/ScheduleRepositoryInMemory';
import { ListSchedulesByBarberService } from './listSchedulesByBarberService';

describe('ListSchedulesByBarberService', () => {
	let scheduleRepositoryInMemory: ScheduleRepositoryInMemory;
	let listSchedulesByBarberService: ListSchedulesByBarberService;

	beforeEach(() => {
		scheduleRepositoryInMemory = new ScheduleRepositoryInMemory();
		listSchedulesByBarberService = new ListSchedulesByBarberService(
			scheduleRepositoryInMemory,
		);
	});

	it('should be able to list all schedules by barber', async () => {
		await scheduleRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			clientId: 'clientId',
			barberId: 'barberId',
			serviceId: 'serviceId',
			date: '2026-03-15',
			startTime: '10:00',
			endTime: '10:30',
		});

		await scheduleRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			clientId: 'clientId2',
			barberId: 'barberId',
			serviceId: 'serviceId',
			date: '2026-03-15',
			startTime: '11:00',
			endTime: '11:30',
		});

		await scheduleRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			clientId: 'clientId',
			barberId: 'otherBarberId',
			serviceId: 'serviceId',
			date: '2026-03-15',
			startTime: '10:00',
			endTime: '10:30',
		});

		const schedules = await listSchedulesByBarberService.execute('barberId');

		expect(schedules).toHaveLength(2);
	});

	it('should return an empty array if no schedules found', async () => {
		const schedules = await listSchedulesByBarberService.execute('barberId');

		expect(schedules).toHaveLength(0);
	});
});
