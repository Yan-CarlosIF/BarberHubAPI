import { AppError } from '@shared/errors/appError';
import { UserRepositoryInMemory } from '../../repository/inMemory/userRepositoryInMemory';
import { RegisterClientUseCase } from './registerClientUseCase';

describe('[POST] /auth/register', () => {
	let userRepositoryInMemory: UserRepositoryInMemory;
	let registerClientUseCase: RegisterClientUseCase;

	beforeEach(() => {
		userRepositoryInMemory = new UserRepositoryInMemory();
		registerClientUseCase = new RegisterClientUseCase(userRepositoryInMemory);
	});

	it('should be able to create a client', async () => {
		await registerClientUseCase.execute({
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
		expect(userRepositoryInMemory.clients[0].userId).toBe(
			userRepositoryInMemory.users[0].id,
		);
	});

	it('should not be able to create a client with an existing email', async () => {
		await registerClientUseCase.execute({
			email: 'H4t2V@example.com',
			barberShopId: 'barberShopId',
			birthDate: new Date(),
			name: 'John Doe',
			password: '123456',
			phone: '123456789',
			isActive: true,
		});

		await expect(
			registerClientUseCase.execute({
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
