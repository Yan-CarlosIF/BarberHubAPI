import 'reflect-metadata';

import { BarberShopRepositoryInMemory } from '@modules/BarberShop/repositories/inMemory/barberShopRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { UserRepositoryInMemory } from '../../repositories/inMemory/userRepositoryInMemory';
import { RegisterClientService } from './registerClientService';

describe('RegisterClientService', () => {
  let userRepositoryInMemory: UserRepositoryInMemory;
  let barberShopRepositoryInMemory: BarberShopRepositoryInMemory; // You should create an in-memory repository for BarberShop as well
  let registerClientService: RegisterClientService;

  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    barberShopRepositoryInMemory = new BarberShopRepositoryInMemory();
    registerClientService = new RegisterClientService(
      userRepositoryInMemory,
      barberShopRepositoryInMemory,
    );

    barberShopRepositoryInMemory.create({
      name: 'Barber Shop',
      slug: 'barber-shop',
      city: 'City',
      state: 'State',
      cep: '12345-678',
      description: 'Description',
      phone: '123456789',
      email: 'barbershop@example.com',
      street: 'Street',
    });
  });

  it('should be able to create a client', async () => {
    await registerClientService.execute({
      email: 'H4t2V@example.com',
      barberShopId: 'barber-shop',
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
    await registerClientService.execute({
      email: 'H4t2V@example.com',
      barberShopId: 'barber-shop',
      birthDate: new Date(),
      name: 'John Doe',
      password: '123456',
      phone: '123456789',
      isActive: true,
    });

    await expect(
      registerClientService.execute({
        email: 'H4t2V@example.com',
        barberShopId: 'barber-shop',
        birthDate: new Date(),
        name: 'John Doe',
        password: '123456',
        phone: '123456789',
        isActive: true,
      }),
    ).rejects.toEqual(new AppError('Email already registered', 400));
  });
});
