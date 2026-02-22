import {
	createServiceBodySchema,
	type ICreateServiceBodyDTO,
} from '@modules/Service/dtos/ICreateServiceDTO';
import { CreateServiceService } from '@modules/Service/services/createService.service';
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
}
