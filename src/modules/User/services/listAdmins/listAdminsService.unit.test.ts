import 'reflect-metadata';

import type { BarberShop } from '@modules/BarberShop/infra/prisma/entities/BarberShop';
import { BarberShopRepositoryInMemory } from '@modules/BarberShop/repositories/inMemory/barberShopRepositoryInMemory';
import type { User } from '@modules/User/infra/prisma/entities/User';
import { mapUserWithoutPassword } from '@modules/User/mapper/User.mapper';
import { UserRepositoryInMemory } from '@modules/User/repositories/inMemory/userRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { ListAdminsService } from './listAdminsService';

describe('ListAdminService', () => {
  let barberShopRepositoryInMemory: BarberShopRepositoryInMemory;
  let userRepositoryInMemory: UserRepositoryInMemory;
  let listAdminService: ListAdminsService;
  let barberShop: BarberShop;
  let createdAdmins: User[];

  beforeAll(async () => {
    barberShopRepositoryInMemory = new BarberShopRepositoryInMemory();
    userRepositoryInMemory = new UserRepositoryInMemory();
    listAdminService = new ListAdminsService(
      userRepositoryInMemory,
      barberShopRepositoryInMemory,
    );

    await barberShopRepositoryInMemory.create({
      name: 'Barber Shop',
      slug: 'barber-shop',
      cep: '12345678',
      city: 'City',
      state: 'State',
      description: 'Description',
      street: 'Street',
      phone: '11999999999',
      email: 'barbershop@example.com',
    });

    barberShop = barberShopRepositoryInMemory.barberShops[0];
    await userRepositoryInMemory.createAdmin({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password',
      barberShopId: barberShop.id,
      isActive: true,
    });

    await userRepositoryInMemory.createAdmin({
      name: 'Admin User 2',
      email: 'admin2@example.com',
      password: 'password',
      barberShopId: barberShop.id,
      isActive: true,
    });

    createdAdmins = [
      userRepositoryInMemory.users[0],
      userRepositoryInMemory.users[1],
    ];
  });

  it('should be able to list admins of a barbershop', async () => {
    const admins = await listAdminService.execute(barberShop.id);

    const createdAdminsWithoutPassword = createdAdmins.map((admin) =>
      mapUserWithoutPassword(admin),
    );

    expect(admins).toHaveLength(2);
    expect(admins[0]).toEqual(createdAdminsWithoutPassword[0]);
    expect(admins[1]).toEqual(createdAdminsWithoutPassword[1]);
  });

  it('should be able to list admins of a barbershop by slug', async () => {
    const admins = await listAdminService.execute(barberShop.slug);

    const createdAdminsWithoutPassword = createdAdmins.map((admin) =>
      mapUserWithoutPassword(admin),
    );

    expect(admins).toHaveLength(2);
    expect(admins[0]).toEqual(createdAdminsWithoutPassword[0]);
    expect(admins[1]).toEqual(createdAdminsWithoutPassword[1]);
  });

  it('should not be able to list user password', async () => {
    const admins = await listAdminService.execute(barberShop.id);

    expect(admins[0]).not.toHaveProperty('password');
    expect(admins[1]).not.toHaveProperty('password');
  });

  it('should not be able to list admins of a non existing barbershop', async () => {
    await expect(
      listAdminService.execute('non-existing-barber-shop'),
    ).rejects.toEqual(new AppError('Barber shop not found', 404));
  });
});
