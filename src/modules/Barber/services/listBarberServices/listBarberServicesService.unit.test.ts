import 'reflect-metadata';

import { BarberServiceRepositoryInMemory } from '@modules/Barber/repositories/inMemory/BarberServiceRepositoryInMemory';
import { ListBarberServicesService } from './listBarberServicesService';

describe('ListBarberServicesService', () => {
	let barberServiceRepositoryInMemory: BarberServiceRepositoryInMemory;
	let listBarberServicesService: ListBarberServicesService;

	beforeEach(() => {
		barberServiceRepositoryInMemory = new BarberServiceRepositoryInMemory();
		listBarberServicesService = new ListBarberServicesService(
			barberServiceRepositoryInMemory,
		);
	});

	it('should list all services assigned to a barber', async () => {
		await barberServiceRepositoryInMemory.assign({
			barberId: 'barberId',
			serviceId: 'serviceId1',
		});

		await barberServiceRepositoryInMemory.assign({
			barberId: 'barberId',
			serviceId: 'serviceId2',
		});

		const result = await listBarberServicesService.execute('barberId');

		expect(result).toHaveLength(2);
	});

	it('should return empty array when barber has no assigned services', async () => {
		const result = await listBarberServicesService.execute('barberId');

		expect(result).toHaveLength(0);
	});
});
