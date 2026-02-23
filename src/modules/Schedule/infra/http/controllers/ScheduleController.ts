import {
	createScheduleBodySchema,
	type ICreateScheduleBodyDTO,
} from '@modules/Schedule/dtos/ICreateScheduleDTO';
import { updateScheduleStatusBodySchema } from '@modules/Schedule/dtos/IUpdateScheduleStatusDTO';
import { CancelScheduleService } from '@modules/Schedule/services/cancelSchedule/cancelScheduleService';
import { CreateScheduleService } from '@modules/Schedule/services/createSchedule/createScheduleService';
import { ListSchedulesByBarberService } from '@modules/Schedule/services/listSchedulesByBarber/listSchedulesByBarberService';
import { ListSchedulesByBarberShopService } from '@modules/Schedule/services/listSchedulesByBarberShop/listSchedulesByBarberShopService';
import { ListSchedulesByClientService } from '@modules/Schedule/services/listSchedulesByClient/listSchedulesByClientService';
import { UpdateScheduleStatusService } from '@modules/Schedule/services/updateScheduleStatus/updateScheduleStatusService';
import { AppError } from '@shared/errors/appError';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';

export class ScheduleController {
	async create(
		request: Request<
			{ barberShopId: string },
			unknown,
			ICreateScheduleBodyDTO
		>,
		response: Response,
	) {
		const { barberShopId } = z
			.object({ barberShopId: z.uuid() })
			.parse(request.params);

		const { barberId, serviceId, date, startTime } =
			createScheduleBodySchema.parse(request.body);

		if (!request.user) {
			throw new AppError('User not authenticated', 401);
		}

		const createScheduleService = container.resolve(CreateScheduleService);

		await createScheduleService.execute({
			barberShopId,
			clientId: request.user.id,
			barberId,
			serviceId,
			date,
			startTime,
		});

		return response
			.status(201)
			.json({ message: 'Schedule created successfully' });
	}

	async cancel(
		request: Request<{ barberShopId: string; id: string }>,
		response: Response,
	) {
		const { id } = z
			.object({
				barberShopId: z.uuid(),
				id: z.uuid(),
			})
			.parse(request.params);

		const cancelScheduleService = container.resolve(CancelScheduleService);

		await cancelScheduleService.execute(id);

		return response.status(204).send();
	}

	async updateStatus(
		request: Request<{ barberShopId: string; id: string }>,
		response: Response,
	) {
		const { id } = z
			.object({
				barberShopId: z.uuid(),
				id: z.uuid(),
			})
			.parse(request.params);

		const { status } = updateScheduleStatusBodySchema.parse(request.body);

		const updateScheduleStatusService = container.resolve(
			UpdateScheduleStatusService,
		);

		await updateScheduleStatusService.execute({ id, status });

		return response.status(204).send();
	}

	async listByBarberShop(
		request: Request<{ barberShopId: string }>,
		response: Response,
	) {
		const { barberShopId } = z
			.object({ barberShopId: z.uuid() })
			.parse(request.params);

		const listSchedulesByBarberShopService = container.resolve(
			ListSchedulesByBarberShopService,
		);

		const schedules =
			await listSchedulesByBarberShopService.execute(barberShopId);

		return response.status(200).json(schedules);
	}

	async listByClient(request: Request, response: Response) {
		if (!request.user) {
			throw new AppError('User not authenticated', 401);
		}

		const listSchedulesByClientService = container.resolve(
			ListSchedulesByClientService,
		);

		const schedules = await listSchedulesByClientService.execute(
			request.user.id,
		);

		return response.status(200).json(schedules);
	}

	async listByBarber(
		request: Request<{ barberShopId: string; barberId: string }>,
		response: Response,
	) {
		const { barberId } = z
			.object({
				barberShopId: z.uuid(),
				barberId: z.uuid(),
			})
			.parse(request.params);

		const listSchedulesByBarberService = container.resolve(
			ListSchedulesByBarberService,
		);

		const schedules =
			await listSchedulesByBarberService.execute(barberId);

		return response.status(200).json(schedules);
	}
}
