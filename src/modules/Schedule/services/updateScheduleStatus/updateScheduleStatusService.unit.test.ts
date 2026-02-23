import 'reflect-metadata';

import { ScheduleRepositoryInMemory } from '@modules/Schedule/repositories/inMemory/ScheduleRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { UpdateScheduleStatusService } from './updateScheduleStatusService';

describe('UpdateScheduleStatusService', () => {
	let scheduleRepositoryInMemory: ScheduleRepositoryInMemory;
	let updateScheduleStatusService: UpdateScheduleStatusService;

	beforeEach(() => {
		scheduleRepositoryInMemory = new ScheduleRepositoryInMemory();
		updateScheduleStatusService = new UpdateScheduleStatusService(
			scheduleRepositoryInMemory,
		);
	});

	it('should be able to update schedule status to COMPLETED', async () => {
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

		await updateScheduleStatusService.execute({
			id: schedule.id,
			status: 'COMPLETED',
		});

		expect(scheduleRepositoryInMemory.schedules[0].status).toBe('COMPLETED');
	});

	it('should be able to update schedule status to NO_SHOW', async () => {
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

		await updateScheduleStatusService.execute({
			id: schedule.id,
			status: 'NO_SHOW',
		});

		expect(scheduleRepositoryInMemory.schedules[0].status).toBe('NO_SHOW');
	});

	it('should not be able to update a non-existing schedule', async () => {
		await expect(
			updateScheduleStatusService.execute({
				id: 'non-existing-id',
				status: 'COMPLETED',
			}),
		).rejects.toEqual(new AppError('Schedule not found', 404));
	});

	it('should not be able to update a canceled schedule', async () => {
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
			status: 'CANCELED',
		});

		await expect(
			updateScheduleStatusService.execute({
				id: schedule.id,
				status: 'COMPLETED',
			}),
		).rejects.toEqual(new AppError('Cannot update a canceled schedule', 400));
	});

	it('should not be able to update a completed schedule', async () => {
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

		await expect(
			updateScheduleStatusService.execute({
				id: schedule.id,
				status: 'NO_SHOW',
			}),
		).rejects.toEqual(
			new AppError('Cannot update a completed schedule', 400),
		);
	});
});
