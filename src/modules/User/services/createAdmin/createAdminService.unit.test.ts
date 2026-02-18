import 'reflect-metadata';

import { BarberShopRepositoryInMemory } from '@modules/BarberShop/repositories/inMemory/barberShopRepositoryInMemory';
import { UserRepositoryInMemory } from '@modules/User/repositories/inMemory/userRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { CreateAdminService } from './createAdminService';

const adminData = {
	name: 'Admin User',
	email: 'admin@example.com',
	password: 'admin123',
	isActive: true,
};

describe('createAdminService', () => {
	let barberShopRepositoryInMemory: BarberShopRepositoryInMemory;
	let userRepositoryInMemory: UserRepositoryInMemory;
	let createAdminService: CreateAdminService;

	beforeAll(() => {
		barberShopRepositoryInMemory = new BarberShopRepositoryInMemory();
		userRepositoryInMemory = new UserRepositoryInMemory();
		createAdminService = new CreateAdminService(
			userRepositoryInMemory,
			barberShopRepositoryInMemory,
		);

		barberShopRepositoryInMemory.create({
			name: 'Barber Shop 1',
			phone: '1234567890',
			cep: '12345-678',
			city: 'City A',
			state: 'State A',
			street: 'Street A',
			description: 'Description A',
			email: 'barbershop@example.com',
		});
	});

	it('should be able to create an admin user successfully', async () => {
		const barberShopId = barberShopRepositoryInMemory.barberShops[0].id;

		await createAdminService.execute({
			...adminData,
			barberShopId,
		});

		const createdUser = await userRepositoryInMemory.findByEmail(
			adminData.email,
		);

		expect(createdUser).toBeDefined();
		expect(createdUser?.name).toBe(adminData.name);
		expect(createdUser?.email).toBe(adminData.email);
		expect(createdUser?.role).toBe('ADMIN');
	});

	it('should not be able to create an admin user with an existing email', async () => {
		const barberShopId = barberShopRepositoryInMemory.barberShops[0].id;

		await expect(
			createAdminService.execute({
				...adminData,
				barberShopId,
			}),
		).rejects.toEqual(new AppError('Email already taken', 400));
	});

	it('should not be able to create an admin user with a non-existent barber shop', async () => {
		await expect(
			createAdminService.execute({
				...adminData,
				barberShopId: 'non-existent-id',
			}),
		).rejects.toEqual(new AppError('Barber shop not found', 404));
	});
});
