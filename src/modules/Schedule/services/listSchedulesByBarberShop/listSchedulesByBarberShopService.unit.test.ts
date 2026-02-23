import 'reflect-metadata';

import { ScheduleRepositoryInMemory } from '@modules/Schedule/repositories/inMemory/ScheduleRepositoryInMemory';
import { ListSchedulesByBarberShopService } from './listSchedulesByBarberShopService';

describe('ListSchedulesByBarberShopService', () => {
	let scheduleRepositoryInMemory: ScheduleRepositoryInMemory;
	let listSchedulesByBarberShopService: ListSchedulesByBarberShopService;

	beforeEach(() => {
		scheduleRepositoryInMemory = new ScheduleRepositoryInMemory();
		listSchedulesByBarberShopService = new ListSchedulesByBarberShopService(
			scheduleRepositoryInMemory,
		);
	});

	it('should be able to list all schedules by barber shop', async () => {
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
			barberShopId: 'otherBarberShopId',
			clientId: 'clientId',
			barberId: 'barberId2',
			serviceId: 'serviceId',
			date: '2026-03-15',
			startTime: '10:00',
			endTime: '10:30',
		});

		const schedules =
			await listSchedulesByBarberShopService.execute('barberShopId');

		expect(schedules).toHaveLength(2);
	});

	it('should return an empty array if no schedules found', async () => {
		const schedules =
			await listSchedulesByBarberShopService.execute('barberShopId');

		expect(schedules).toHaveLength(0);
	});
});
