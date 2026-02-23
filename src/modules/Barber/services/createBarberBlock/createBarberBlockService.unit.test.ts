import 'reflect-metadata';

import { BarberBlockRepositoryInMemory } from '@modules/Barber/repositories/inMemory/BarberBlockRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { CreateBarberBlockService } from './createBarberBlockService';

describe('CreateBarberBlockService', () => {
	let barberBlockRepositoryInMemory: BarberBlockRepositoryInMemory;
	let createBarberBlockService: CreateBarberBlockService;

	beforeEach(() => {
		barberBlockRepositoryInMemory = new BarberBlockRepositoryInMemory();
		createBarberBlockService = new CreateBarberBlockService(
			barberBlockRepositoryInMemory,
		);
	});

	it('should be able to create a barber block', async () => {
		await createBarberBlockService.execute({
			barberId: 'barberId',
			date: '2026-03-15',
			startTime: '12:00',
			endTime: '14:00',
		});

		expect(barberBlockRepositoryInMemory.blocks).toHaveLength(1);
		expect(barberBlockRepositoryInMemory.blocks[0].startTime).toBe('12:00');
	});

	it('should not create a block when start time is after end time', async () => {
		await expect(
			createBarberBlockService.execute({
				barberId: 'barberId',
				date: '2026-03-15',
				startTime: '14:00',
				endTime: '12:00',
			}),
		).rejects.toEqual(new AppError('Start time must be before end time', 400));
	});

	it('should not create a block overlapping an existing one', async () => {
		await createBarberBlockService.execute({
			barberId: 'barberId',
			date: '2026-03-15',
			startTime: '12:00',
			endTime: '14:00',
		});

		await expect(
			createBarberBlockService.execute({
				barberId: 'barberId',
				date: '2026-03-15',
				startTime: '13:00',
				endTime: '15:00',
			}),
		).rejects.toEqual(
			new AppError('There is already a block overlapping this time range', 409),
		);
	});
});
