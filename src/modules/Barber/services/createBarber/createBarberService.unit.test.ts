import 'reflect-metadata';

import { UserRepositoryInMemory } from '@modules/User/repositories/inMemory/userRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { CreateBarberService } from './createBarberService';

describe('CreateBarberService', () => {
	let userRepositoryInMemory: UserRepositoryInMemory;
	let createBarberService: CreateBarberService;

	beforeEach(() => {
		userRepositoryInMemory = new UserRepositoryInMemory();
		createBarberService = new CreateBarberService(userRepositoryInMemory);
	});

	it('should be able to create a new barber', async () => {
		await createBarberService.execute({
			email: 'barber@example.com',
			password: '123456',
			name: 'John Doe',
			barberShopId: 'barberShopId',
			isActive: true,
			specialty: 'Corte de cabelo',
		});

		expect(userRepositoryInMemory.barbers).toHaveLength(1);
		expect(userRepositoryInMemory.barbers[0].user.email).toBe(
			'barber@example.com',
		);
		expect(userRepositoryInMemory.barbers[0].userId).toBe(
			userRepositoryInMemory.users[0].id,
		);
	});

	it('should not be able to create a barber with an email that already exists', async () => {
		await createBarberService.execute({
			email: 'barber@example.com',
			password: '123456',
			name: 'John Doe',
			barberShopId: 'barberShopId',
			isActive: true,
			specialty: 'Corte de cabelo',
		});

		await expect(
			createBarberService.execute({
				email: 'barber@example.com',
				password: '123456',
				name: 'John Doe',
				barberShopId: 'barberShopId',
				isActive: true,
				specialty: 'Corte de cabelo',
			}),
		).rejects.toEqual(new AppError('Email already registered', 400));
	});
});
