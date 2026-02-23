import 'reflect-metadata';

import { BarberBlockRepositoryInMemory } from '@modules/Barber/repositories/inMemory/BarberBlockRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { DeleteBarberBlockService } from './deleteBarberBlockService';

describe('DeleteBarberBlockService', () => {
	let barberBlockRepositoryInMemory: BarberBlockRepositoryInMemory;
	let deleteBarberBlockService: DeleteBarberBlockService;

	beforeEach(() => {
		barberBlockRepositoryInMemory = new BarberBlockRepositoryInMemory();
		deleteBarberBlockService = new DeleteBarberBlockService(
			barberBlockRepositoryInMemory,
		);
	});

	it('should be able to delete a barber block', async () => {
		await barberBlockRepositoryInMemory.create({
			barberId: 'barberId',
			date: '2026-03-15',
			startTime: '12:00',
			endTime: '14:00',
		});

		const block = barberBlockRepositoryInMemory.blocks[0];

		await deleteBarberBlockService.execute('barberId', block.id);

		expect(barberBlockRepositoryInMemory.blocks).toHaveLength(0);
	});

	it('should not delete a block that does not exist', async () => {
		await expect(
			deleteBarberBlockService.execute('barberId', 'non-existing-id'),
		).rejects.toEqual(new AppError('Block not found', 404));
	});
});
