import 'reflect-metadata';

import { ServiceRepositoryInMemory } from '@modules/Service/repositories/inMemory/ServiceRepositoryInMemory';
import { ScheduleRepositoryInMemory } from '@modules/Schedule/repositories/inMemory/ScheduleRepositoryInMemory';
import { AppError } from '@shared/errors/appError';
import { Decimal } from '@prisma/client/runtime/client';
import { CreateScheduleService } from './createScheduleService';

describe('CreateScheduleService', () => {
	let scheduleRepositoryInMemory: ScheduleRepositoryInMemory;
	let serviceRepositoryInMemory: ServiceRepositoryInMemory;
	let createScheduleService: CreateScheduleService;

	beforeEach(() => {
		scheduleRepositoryInMemory = new ScheduleRepositoryInMemory();
		serviceRepositoryInMemory = new ServiceRepositoryInMemory();
		createScheduleService = new CreateScheduleService(
			scheduleRepositoryInMemory,
			serviceRepositoryInMemory,
		);
	});

	it('should be able to create a new schedule', async () => {
		await serviceRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			name: 'Corte de cabelo',
			price: 30,
			durationInMinutes: 30,
			description: 'Corte masculino',
		});

		const service = serviceRepositoryInMemory.services[0];

		await createScheduleService.execute({
			barberShopId: 'barberShopId',
			clientId: 'clientId',
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
				barberShopId: 'barberShopId',
				clientId: 'clientId',
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
			barberShopId: 'barberShopId',
			name: 'Barba',
			price: new Decimal(20),
			durationInMinutes: 20,
			description: null,
			isActive: false,
			createdAt: new Date(),
		});

		await expect(
			createScheduleService.execute({
				barberShopId: 'barberShopId',
				clientId: 'clientId',
				barberId: 'barberId',
				serviceId: 'inactive-service',
				date: '2026-03-15',
				startTime: '10:00',
			}),
		).rejects.toEqual(new AppError('Service is not active', 400));
	});

	it('should not be able to create a schedule with a conflicting time slot', async () => {
		await serviceRepositoryInMemory.create({
			barberShopId: 'barberShopId',
			name: 'Corte de cabelo',
			price: 30,
			durationInMinutes: 30,
		});

		const service = serviceRepositoryInMemory.services[0];

		await createScheduleService.execute({
			barberShopId: 'barberShopId',
			clientId: 'clientId',
			barberId: 'barberId',
			serviceId: service.id,
			date: '2026-03-15',
			startTime: '10:00',
		});

		await expect(
			createScheduleService.execute({
				barberShopId: 'barberShopId',
				clientId: 'clientId2',
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
			barberShopId: 'barberShopId',
			name: 'Corte de cabelo',
			price: 30,
			durationInMinutes: 30,
		});

		const service = serviceRepositoryInMemory.services[0];

		await createScheduleService.execute({
			barberShopId: 'barberShopId',
			clientId: 'clientId',
			barberId: 'barberId',
			serviceId: service.id,
			date: '2026-03-15',
			startTime: '10:00',
		});

		await createScheduleService.execute({
			barberShopId: 'barberShopId',
			clientId: 'clientId2',
			barberId: 'barberId',
			serviceId: service.id,
			date: '2026-03-15',
			startTime: '10:30',
		});

		expect(scheduleRepositoryInMemory.schedules).toHaveLength(2);
	});
});
