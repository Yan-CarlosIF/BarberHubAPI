import 'reflect-metadata';

import type { ICreateBarberShopDTO } from '@modules/BarberShop/dtos/IcreateBarberShopDTO';
import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { BarberShopRepositoryInMemory } from '@modules/BarberShop/repositories/inMemory/barberShopRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { CreateBarberShopService } from './createBarberShopService';

const mockBarberShopData: ICreateBarberShopDTO = {
	cep: '12345678',
	city: 'Test City',
	email: 'example@email.com',
	name: 'Test Barber Shop',
	description: 'Test description',
	phone: '1234567890',
	state: 'TS',
	street: 'Test Street',
};

describe('CreateBarberShopService', () => {
	let createBarberShopService: CreateBarberShopService;
	let barberShopRepositoryInMemory: IBarberShopRepository;

	beforeEach(() => {
		barberShopRepositoryInMemory = new BarberShopRepositoryInMemory();
		createBarberShopService = new CreateBarberShopService(
			barberShopRepositoryInMemory,
		);
	});

	it('should be able to create a new barber shop', async () => {
		await createBarberShopService.execute(mockBarberShopData);

		const createdBarberShop = await barberShopRepositoryInMemory.findByEmail(
			mockBarberShopData.email,
		);

		console.log(createdBarberShop);

		expect(createdBarberShop).toBeTruthy();
	});

	it('should not be able to create a barber shop with an email that is already taken', async () => {
		await createBarberShopService.execute(mockBarberShopData);

		await expect(
			createBarberShopService.execute(mockBarberShopData),
		).rejects.toEqual(new AppError('Email already registered', 400));
	});

	it('should not be able to create a barber shop with a phone number that is already taken', async () => {
		await createBarberShopService.execute(mockBarberShopData);

		const newBarberShopData = {
			...mockBarberShopData,
			email: 'email2@example.com',
		};

		await expect(
			createBarberShopService.execute(newBarberShopData),
		).rejects.toEqual(new AppError('Phone number already registered', 400));
	});
});
