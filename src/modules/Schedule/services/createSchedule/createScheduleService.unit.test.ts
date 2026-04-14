import 'reflect-metadata';

import { BarberAvailabilityRepositoryInMemory } from '@modules/Barber/repositories/inMemory/BarberAvailabilityRepositoryInMemory';
import { BarberBlockRepositoryInMemory } from '@modules/Barber/repositories/inMemory/BarberBlockRepositoryInMemory';
import { BarberShopRepositoryInMemory } from '@modules/BarberShop/repositories/inMemory/barberShopRepositoryInMemory';
import { ScheduleRepositoryInMemory } from '@modules/Schedule/repositories/inMemory/ScheduleRepositoryInMemory';
import { ServiceRepositoryInMemory } from '@modules/Service/repositories/inMemory/ServiceRepositoryInMemory';
import { UserRepositoryInMemory } from '@modules/User/repositories/inMemory/userRepositoryInMemory';
import { Decimal } from '@prisma/client/runtime/client';
import { AppError } from '@shared/errors/appError';
import { CreateScheduleService } from './createScheduleService';

describe('CreateScheduleService', () => {
  let scheduleRepositoryInMemory: ScheduleRepositoryInMemory;
  let serviceRepositoryInMemory: ServiceRepositoryInMemory;
  let barberAvailabilityRepositoryInMemory: BarberAvailabilityRepositoryInMemory;
  let barberBlockRepositoryInMemory: BarberBlockRepositoryInMemory;
  let barberShopRepositoryInMemory: BarberShopRepositoryInMemory;
  let userRepositoryInMemory: UserRepositoryInMemory;
  let createScheduleService: CreateScheduleService;

  let userId: string;
  let userId2: string;

  beforeEach(async () => {
    scheduleRepositoryInMemory = new ScheduleRepositoryInMemory();
    serviceRepositoryInMemory = new ServiceRepositoryInMemory();
    barberAvailabilityRepositoryInMemory =
      new BarberAvailabilityRepositoryInMemory();
    barberBlockRepositoryInMemory = new BarberBlockRepositoryInMemory();
    barberShopRepositoryInMemory = new BarberShopRepositoryInMemory();
    userRepositoryInMemory = new UserRepositoryInMemory();
    createScheduleService = new CreateScheduleService(
      scheduleRepositoryInMemory,
      serviceRepositoryInMemory,
      barberAvailabilityRepositoryInMemory,
      barberBlockRepositoryInMemory,
      barberShopRepositoryInMemory,
      userRepositoryInMemory,
    );

    await userRepositoryInMemory.createClient({
      name: 'Client User',
      email: 'client@example.com',
      password: 'password',
      phone: '123456789',
      birthDate: new Date(),
      isActive: true
    });

    userId = userRepositoryInMemory.users[0].id;

    await userRepositoryInMemory.createClient({
      name: 'Client User 2',
      email: 'client2@example.com',
      password: 'password',
      phone: '987654321',
      birthDate: new Date(),
      isActive: true
    });

    userId2 = userRepositoryInMemory.users[1].id;

    // Set barber as available on Sunday 08:00-20:00
    await barberAvailabilityRepositoryInMemory.create({
      barberId: 'barberId',
      weekDay: 'SUNDAY',
      startTime: '08:00',
      endTime: '20:00',
    });

    // Also set Monday availability for some tests
    await barberAvailabilityRepositoryInMemory.create({
      barberId: 'barberId',
      weekDay: 'MONDAY',
      startTime: '08:00',
      endTime: '20:00',
    });

    await barberShopRepositoryInMemory.create({
      name: 'Barber Shop',
      slug: 'barber-shop',
      cep: '12345-678',
      description: 'A great place for a haircut',
      city: 'Cidade Exemplo',
      state: 'Estado Exemplo',
      email: 'barbershop@example.com',
      phone: '123456789',
      street: 'Rua Exemplo, 123',
    });
  });

  it('should be able to create a new schedule', async () => {
    await serviceRepositoryInMemory.create({
      barberShopId: 'barber-shop',
      name: 'Corte de cabelo',
      price: 30,
      durationInMinutes: 30,
      description: 'Corte masculino',
    });

    const service = serviceRepositoryInMemory.services[0];

    await createScheduleService.execute({
      barberShopId: 'barber-shop',
      userId,
      barberId: 'barberId',
      serviceId: service.id,
      date: '2026-03-15',
      startTime: '10:00',
    });

    expect(scheduleRepositoryInMemory.schedules).toHaveLength(1);
    expect(scheduleRepositoryInMemory.schedules[0].startTime).toBe('10:00');
    expect(scheduleRepositoryInMemory.schedules[0].endTime).toBe('10:30');
    expect(scheduleRepositoryInMemory.schedules[0].status).toBe('SCHEDULED');
  });

  it('should not be able to create a schedule with a non-existing service', async () => {
    await expect(
      createScheduleService.execute({
        barberShopId: 'barber-shop',
        userId,
        barberId: 'barberId',
        serviceId: 'non-existing-service-id',
        date: '2026-03-15',
        startTime: '10:00',
      }),
    ).rejects.toEqual(new AppError('Service not found', 404));
  });

  it('should not be able to create a schedule with an inactive service', async () => {
    serviceRepositoryInMemory.services.push({
      id: 'inactive-service',
      barberShopId: 'barber-shop',
      name: 'Barba',
      price: new Decimal(20),
      durationInMinutes: 20,
      description: null,
      isActive: false,
      createdAt: new Date(),
    });

    await expect(
      createScheduleService.execute({
        barberShopId: 'barber-shop',
        userId,
        barberId: 'barberId',
        serviceId: 'inactive-service',
        date: '2026-03-15',
        startTime: '10:00',
      }),
    ).rejects.toEqual(new AppError('Service is not active', 400));
  });

  it('should not be able to create a schedule with a conflicting time slot', async () => {
    await serviceRepositoryInMemory.create({
      barberShopId: 'barber-shop',
      name: 'Corte de cabelo',
      price: 30,
      durationInMinutes: 30,
    });

    const service = serviceRepositoryInMemory.services[0];

    await createScheduleService.execute({
      barberShopId: 'barber-shop',
      userId,
      barberId: 'barberId',
      serviceId: service.id,
      date: '2026-03-15',
      startTime: '10:00',
    });

    await expect(
      createScheduleService.execute({
        barberShopId: 'barber-shop',
        userId: userId2,
        barberId: 'barberId',
        serviceId: service.id,
        date: '2026-03-15',
        startTime: '10:15',
      }),
    ).rejects.toEqual(
      new AppError('This time slot is already booked for this barber', 409),
    );
  });

  it('should allow scheduling at a non-conflicting time', async () => {


    await serviceRepositoryInMemory.create({
      barberShopId: 'barber-shop',
      name: 'Corte de cabelo',
      price: 30,
      durationInMinutes: 30,
    });

    const service = serviceRepositoryInMemory.services[0];

    await createScheduleService.execute({
      barberShopId: 'barber-shop',
      userId,
      barberId: 'barberId',
      serviceId: service.id,
      date: '2026-03-15',
      startTime: '10:00',
    });

    await createScheduleService.execute({
      barberShopId: 'barber-shop',
      userId: userId2,
      barberId: 'barberId',
      serviceId: service.id,
      date: '2026-03-15',
      startTime: '10:30',
    });

    expect(scheduleRepositoryInMemory.schedules).toHaveLength(2);
  });

  it('should not allow scheduling on a day the barber is not available', async () => {
    await serviceRepositoryInMemory.create({
      barberShopId: 'barber-shop',
      name: 'Corte de cabelo',
      price: 30,
      durationInMinutes: 30,
    });

    const service = serviceRepositoryInMemory.services[0];

    // 2026-03-17 is a Tuesday — no availability set
    await expect(
      createScheduleService.execute({
        barberShopId: 'barber-shop',
        userId,
        barberId: 'barberId',
        serviceId: service.id,
        date: '2026-03-17',
        startTime: '10:00',
      }),
    ).rejects.toEqual(new AppError('Barber is not available on this day', 400));
  });

  it('should not allow scheduling outside barber working hours', async () => {
    await serviceRepositoryInMemory.create({
      barberShopId: 'barber-shop',
      name: 'Corte de cabelo',
      price: 30,
      durationInMinutes: 30,
    });

    const service = serviceRepositoryInMemory.services[0];

    // Start at 19:45 → ends at 20:15 which exceeds availability endTime 20:00
    await expect(
      createScheduleService.execute({
        barberShopId: 'barber-shop',
        userId,
        barberId: 'barberId',
        serviceId: service.id,
        date: '2026-03-15',
        startTime: '19:45',
      }),
    ).rejects.toEqual(
      new AppError('Schedule is outside barber working hours', 400),
    );
  });

  it('should not allow scheduling when barber has a block on that time', async () => {
    await serviceRepositoryInMemory.create({
      barberShopId: 'barber-shop',
      name: 'Corte de cabelo',
      price: 30,
      durationInMinutes: 30,
    });

    const service = serviceRepositoryInMemory.services[0];

    await barberBlockRepositoryInMemory.create({
      barberId: 'barberId',
      date: '2026-03-15',
      startTime: '10:00',
      endTime: '11:00',
    });

    await expect(
      createScheduleService.execute({
        barberShopId: 'barber-shop',
        userId,
        barberId: 'barberId',
        serviceId: service.id,
        date: '2026-03-15',
        startTime: '10:15',
      }),
    ).rejects.toEqual(new AppError('Barber has blocked this time slot', 409));
  });
});
