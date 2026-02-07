import { UserRepositoryInMemory } from '@modules/User/repository/inMemory/userRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { CreateBarberUseCase } from './createBarberUseCase';

describe('[POST] /barbers', () => {
	let userRepositoryInMemory: UserRepositoryInMemory;
	let createBarberUseCase: CreateBarberUseCase;

	beforeEach(() => {
		userRepositoryInMemory = new UserRepositoryInMemory();
		createBarberUseCase = new CreateBarberUseCase(userRepositoryInMemory);
	});

	it('should be able to create a new barber', async () => {
		await createBarberUseCase.execute({
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
		await createBarberUseCase.execute({
			email: 'barber@example.com',
			password: '123456',
			name: 'John Doe',
			barberShopId: 'barberShopId',
			isActive: true,
			specialty: 'Corte de cabelo',
		});

		await expect(
			createBarberUseCase.execute({
				email: 'barber@example.com',
				password: '123456',
				name: 'John Doe',
				barberShopId: 'barberShopId',
				isActive: true,
				specialty: 'Corte de cabelo',
			}),
		).rejects.toEqual(new AppError('User already exists', 400));
	});
});
