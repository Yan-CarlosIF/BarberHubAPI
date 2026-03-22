import 'reflect-metadata';

import { BarberShopRepositoryInMemory } from '@modules/BarberShop/repositories/inMemory/barberShopRepositoryInMemory';
import { UserRepositoryInMemory } from '@modules/User/repositories/inMemory/userRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { CreateBarberService } from './createBarberService';

describe('CreateBarberService', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let barberShopRepositoryInMemory: BarberShopRepositoryInMemory;
  let createBarberService: CreateBarberService;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    barberShopRepositoryInMemory = new BarberShopRepositoryInMemory();
    createBarberService = new CreateBarberService(
      userRepositoryInMemory,
      barberShopRepositoryInMemory,
    );

    barberShopRepositoryInMemory.create({
      slug: 'barber-shop',
      cep: '12345-678',
      city: 'City',
      description: 'Description',
      email: 'barber-shop@example.com',
      name: 'Barber Shop',
      phone: '1234567890',
      state: 'State',
      street: 'Street',
    });
  });

  it('should be able to create a new barber', async () => {
    await createBarberService.execute({
      email: 'barber@example.com',
      password: '123456',
      name: 'John Doe',
      barberShopId: 'barber-shop',
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
      barberShopId: 'barber-shop',
      isActive: true,
      specialty: 'Corte de cabelo',
    });

    await expect(
      createBarberService.execute({
        email: 'barber@example.com',
        password: '123456',
        name: 'John Doe',
        barberShopId: 'barber-shop',
        isActive: true,
        specialty: 'Corte de cabelo',
      }),
    ).rejects.toEqual(new AppError('Email already registered', 400));
  });
});
