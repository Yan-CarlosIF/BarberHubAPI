import { AppError } from '@shared/errors/appError';
import { beforeEach, describe, expect, it } from 'vitest';
import { UserRepositoryInMemory } from '../../repository/inMemory/userRepositoryInMemory';
import { CreateClientUseCase } from './createClientUseCase';

describe('[POST] /clients', () => {
	let userRepositoryInMemory: UserRepositoryInMemory;
	let createClientUseCase: CreateClientUseCase;

	beforeEach(() => {
		userRepositoryInMemory = new UserRepositoryInMemory();
		createClientUseCase = new CreateClientUseCase(userRepositoryInMemory);
	});

	it('should be able to create a client', async () => {
		await createClientUseCase.execute({
			email: 'H4t2V@example.com',
			barberShopId: 'barberShopId',
			birthDate: new Date(),
			name: 'John Doe',
			password: '123456',
			phone: '123456789',
			isActive: true,
		});

		expect(userRepositoryInMemory.users).toHaveLength(1);
		expect(userRepositoryInMemory.clients).toHaveLength(1);
		expect(userRepositoryInMemory.users[0].email).toBe('H4t2V@example.com');
	});

	it('should not be able to create a client with an existing email', async () => {
		await createClientUseCase.execute({
			email: 'H4t2V@example.com',
			barberShopId: 'barberShopId',
			birthDate: new Date(),
			name: 'John Doe',
			password: '123456',
			phone: '123456789',
			isActive: true,
		});

		await expect(
			createClientUseCase.execute({
				email: 'H4t2V@example.com',
				barberShopId: 'barberShopId',
				birthDate: new Date(),
				name: 'John Doe',
				password: '123456',
				phone: '123456789',
				isActive: true,
			}),
		).rejects.toEqual(new AppError('User already exists', 400));
	});
});
