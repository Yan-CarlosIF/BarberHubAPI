import 'reflect-metadata';

import { BarberBlockRepositoryInMemory } from '@modules/Barber/repositories/inMemory/BarberBlockRepositoryInMemory';
import { ListBarberBlocksService } from './listBarberBlocksService';

describe('ListBarberBlocksService', () => {
	let barberBlockRepositoryInMemory: BarberBlockRepositoryInMemory;
	let listBarberBlocksService: ListBarberBlocksService;

	beforeEach(() => {
		barberBlockRepositoryInMemory = new BarberBlockRepositoryInMemory();
		listBarberBlocksService = new ListBarberBlocksService(
			barberBlockRepositoryInMemory,
		);
	});

	it('should list all blocks for a barber', async () => {
		await barberBlockRepositoryInMemory.create({
			barberId: 'barberId',
			date: '2026-03-15',
			startTime: '12:00',
			endTime: '14:00',
		});

		await barberBlockRepositoryInMemory.create({
			barberId: 'barberId',
			date: '2026-03-16',
			startTime: '09:00',
			endTime: '11:00',
		});

		const result = await listBarberBlocksService.execute('barberId');

		expect(result).toHaveLength(2);
	});

	it('should return empty array when barber has no blocks', async () => {
		const result = await listBarberBlocksService.execute('barberId');

		expect(result).toHaveLength(0);
	});
});
