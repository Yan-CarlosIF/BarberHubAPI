import {
	createServiceBodySchema,
	type ICreateServiceBodyDTO,
} from '@modules/Service/dtos/ICreateServiceDTO';
import { updateServiceSchema } from '@modules/Service/dtos/IUpdateServiceDTO';
import { CreateServiceService } from '@modules/Service/services/createService.service';
import { DeleteServiceService } from '@modules/Service/services/deleteService/deleteService.service';
import { ListServicesService } from '@modules/Service/services/listServices/listServices.service';
import { UpdateServiceService } from '@modules/Service/services/updateService/updateService.service';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';

export class ServiceController {
	async create(
		request: Request<{ barberShopId: string }, unknown, ICreateServiceBodyDTO>,
		response: Response,
	) {
		const { barberShopId } = z
			.object({ barberShopId: z.uuid() })
			.parse(request.params);

		const { name, description, price, durationInMinutes } =
			createServiceBodySchema.parse(request.body);

		const createServiceService = container.resolve(CreateServiceService);

		await createServiceService.execute({
			barberShopId,
			name,
			description,
			price,
			durationInMinutes,
		});

		return response.status(201).send();
	}

	async list(request: Request<{ barberShopId: string }>, response: Response) {
		const { barberShopId } = z
			.object({ barberShopId: z.uuid() })
			.parse(request.params);

		const listServicesService = container.resolve(ListServicesService);

		const services = await listServicesService.execute(barberShopId);

		return response.status(200).json(services);
	}

	async update(
		request: Request<{ barberShopId: string; id: string }>,
		response: Response,
	) {
		const { id } = z
			.object({
				barberShopId: z.uuid(),
				id: z.uuid(),
			})
			.parse(request.params);

		const data = updateServiceSchema.parse(request.body);

		const updateServiceService = container.resolve(UpdateServiceService);

		await updateServiceService.execute(id, data);

		return response.status(204).send();
	}

	async delete(
		request: Request<{ barberShopId: string; id: string }>,
		response: Response,
	) {
		const { id } = z
			.object({
				barberShopId: z.uuid(),
				id: z.uuid(),
			})
			.parse(request.params);

		const deleteServiceService = container.resolve(DeleteServiceService);

		await deleteServiceService.execute(id);

		return response.status(204).send();
	}
}
