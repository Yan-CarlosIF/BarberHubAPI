import 'reflect-metadata';

import { ScheduleRepositoryInMemory } from '@modules/Schedule/repositories/inMemory/ScheduleRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { CancelScheduleService } from './cancelScheduleService';

describe('CancelScheduleService', () => {
	let scheduleRepositoryInMemory: ScheduleRepositoryInMemory;
	let cancelScheduleService: CancelScheduleService;

	beforeEach(() => {
		scheduleRepositoryInMemory = new ScheduleRepositoryInMemory();
		cancelScheduleService = new CancelScheduleService(
			scheduleRepositoryInMemory,
		);
	});

	it('should be able to cancel a schedule', async () => {
		await scheduleRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			clientId: 'clientId',
			barberId: 'barberId',
			serviceId: 'serviceId',
			date: '2026-03-15',
			startTime: '10:00',
			endTime: '10:30',
		});

		const schedule = scheduleRepositoryInMemory.schedules[0];

		await cancelScheduleService.execute(schedule.id);

		expect(scheduleRepositoryInMemory.schedules[0].status).toBe('CANCELED');
	});

	it('should not be able to cancel a non-existing schedule', async () => {
		await expect(
			cancelScheduleService.execute('non-existing-id'),
		).rejects.toEqual(new AppError('Schedule not found', 404));
	});

	it('should not be able to cancel an already canceled schedule', async () => {
		await scheduleRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			clientId: 'clientId',
			barberId: 'barberId',
			serviceId: 'serviceId',
			date: '2026-03-15',
			startTime: '10:00',
			endTime: '10:30',
		});

		const schedule = scheduleRepositoryInMemory.schedules[0];

		await cancelScheduleService.execute(schedule.id);

		await expect(cancelScheduleService.execute(schedule.id)).rejects.toEqual(
			new AppError('Schedule is already canceled', 400),
		);
	});

	it('should not be able to cancel a completed schedule', async () => {
		await scheduleRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			clientId: 'clientId',
			barberId: 'barberId',
			serviceId: 'serviceId',
			date: '2026-03-15',
			startTime: '10:00',
			endTime: '10:30',
		});

		const schedule = scheduleRepositoryInMemory.schedules[0];

		await scheduleRepositoryInMemory.updateStatus({
			id: schedule.id,
			status: 'COMPLETED',
		});

		await expect(cancelScheduleService.execute(schedule.id)).rejects.toEqual(
			new AppError('Cannot cancel a completed schedule', 400),
		);
	});
});
