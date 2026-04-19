import "reflect-metadata";

import type { BarberShop } from '@modules/BarberShop/infra/prisma/entities/BarberShop';
import { BarberShopRepositoryInMemory } from '@modules/BarberShop/repositories/inMemory/barberShopRepositoryInMemory';
import { ListBarberShopsWithPaginationService } from './listBarberShopsWithPaginationService';

describe('List BarberShops With Pagination Service', () => {
  let barberShopsRepository: BarberShopRepositoryInMemory;
  let listBarberShopsWithPaginationService: ListBarberShopsWithPaginationService;
  const barberShopsData: BarberShop[] = [];

  beforeAll(() => {
    barberShopsRepository = new BarberShopRepositoryInMemory();
    listBarberShopsWithPaginationService =
      new ListBarberShopsWithPaginationService(barberShopsRepository);

    for (let i = 1; i <= 20; i++) {
      const barberShopData: BarberShop = {
        id: `barberShop-${i}`,
        name: `Barber Shop ${i}`,
        email: `barberShop${i}@example.com`,
        phone: `123456789${i}`,
        description: `Description for Barber Shop ${i}`,
        slug: `barber-shop-${i}`,
        createdAt: new Date(),
        cep: `12345-67${i}`,
        city: `City ${i}`,
        state: `State ${i}`,
        street: `Street ${i}`,
      }

      barberShopsData.push(barberShopData)
      barberShopsRepository.create(barberShopData);
    }
  });

  it('should be able to list the barber shops with pagination', async () => {
    const result = await listBarberShopsWithPaginationService.execute({
      limit: 5,
      offset: 0,
    });

    expect(result.total).toBe(20);
    expect(result.items).toHaveLength(5);
    expect(result.items[0].name).toBe('Barber Shop 1');
    expect(result.items[4].name).toBe('Barber Shop 5');
  });

  it('should be able to list the barber shops with pagination and search', async () => {
    const result = await listBarberShopsWithPaginationService.execute({
      limit: 5,
      offset: 0,
      search: 'Barber Shop 1',
    });

    expect(result.total).toBe(11);
    expect(result.items).toHaveLength(5);
    expect(result.items[0].name).toBe('Barber Shop 1');
    expect(result.items[1].name).toBe('Barber Shop 10');
    expect(result.items[2].name).toBe('Barber Shop 11');
    expect(result.items[3].name).toBe('Barber Shop 12');
    expect(result.items[4].name).toBe('Barber Shop 13');
  })
});
