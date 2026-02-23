import 'reflect-metadata';

import { ScheduleRepositoryInMemory } from '@modules/Schedule/repositories/inMemory/ScheduleRepositoryInMemory';
import { ListSchedulesByClientService } from './listSchedulesByClientService';

describe('ListSchedulesByClientService', () => {
	let scheduleRepositoryInMemory: ScheduleRepositoryInMemory;
	let listSchedulesByClientService: ListSchedulesByClientService;

	beforeEach(() => {
		scheduleRepositoryInMemory = new ScheduleRepositoryInMemory();
		listSchedulesByClientService = new ListSchedulesByClientService(
			scheduleRepositoryInMemory,
		);
	});

	it('should be able to list all schedules by client', async () => {
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
			clientId: 'clientId',
			barberId: 'barberId2',
			serviceId: 'serviceId',
			date: '2026-03-16',
			startTime: '14:00',
			endTime: '14:30',
		});

		await scheduleRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			clientId: 'otherClientId',
			barberId: 'barberId',
			serviceId: 'serviceId',
			date: '2026-03-15',
			startTime: '11:00',
			endTime: '11:30',
		});

		const schedules = await listSchedulesByClientService.execute('clientId');

		expect(schedules).toHaveLength(2);
	});

	it('should return an empty array if no schedules found', async () => {
		const schedules = await listSchedulesByClientService.execute('clientId');

		expect(schedules).toHaveLength(0);
	});
});
