import 'reflect-metadata';

import { ScheduleRepositoryInMemory } from '@modules/Schedule/repositories/inMemory/ScheduleRepositoryInMemory';
import { UserRepositoryInMemory } from '@modules/User/repositories/inMemory/userRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { ListSchedulesByClientService } from './listSchedulesByClientService';

describe('ListSchedulesByClientService', () => {
  let scheduleRepositoryInMemory: ScheduleRepositoryInMemory;
  let userRepositoryInMemory: UserRepositoryInMemory;
  let listSchedulesByClientService: ListSchedulesByClientService;

  let userId: string;
  let clientId: string;

  beforeEach(async () => {
    scheduleRepositoryInMemory = new ScheduleRepositoryInMemory();
    userRepositoryInMemory = new UserRepositoryInMemory();
    listSchedulesByClientService = new ListSchedulesByClientService(
      scheduleRepositoryInMemory,
      userRepositoryInMemory,
    );

    await userRepositoryInMemory.createClient({
      name: 'Client User',
      email: 'client@example.com',
      password: 'password',
      phone: '123456789',
      birthDate: new Date(),
      isActive: true,
    });

    userId = userRepositoryInMemory.users[0].id;
    clientId = userRepositoryInMemory.clients[0].id;
  });

  it('should be able to list all schedules by client', async () => {
    await scheduleRepositoryInMemory.create({
      barberShopId: 'barberShopId',
      clientId,
      barberId: 'barberId',
      serviceId: 'serviceId',
      date: '2026-03-15',
      startTime: '10:00',
      endTime: '10:30',
    });

    await scheduleRepositoryInMemory.create({
      barberShopId: 'barberShopId',
      clientId,
      barberId: 'barberId2',
      serviceId: 'serviceId',
      date: '2026-03-16',
      startTime: '14:00',
      endTime: '14:30',
    });

    await scheduleRepositoryInMemory.create({
      barberShopId: 'barberShopId',
      clientId: 'otherClientId',
      barberId: 'barberId',
      serviceId: 'serviceId',
      date: '2026-03-15',
      startTime: '11:00',
      endTime: '11:30',
    });

    const schedules = await listSchedulesByClientService.execute(userId);

    expect(schedules).toHaveLength(2);
  });

  it('should return an empty array if no schedules found', async () => {
    await userRepositoryInMemory.createClient({
      name: 'Another Client User',
      email: 'anotherclient@example.com',
      password: 'password',
      phone: '987654321',
      birthDate: new Date(),
      isActive: true,
    });

    const anotherUserId = userRepositoryInMemory.users[1].id;

    const schedules = await listSchedulesByClientService.execute(anotherUserId);

    expect(schedules).toHaveLength(0);
  });

  it("should not be able to list schedules if client doesn't exist", async () => {
    const nonExistentUserId = 'nonExistentUserId';

    await expect(
      listSchedulesByClientService.execute(nonExistentUserId)
    ).rejects.toEqual(new AppError('Client profile not found', 404));
  });
});
