import {
	createBarberShopDTO,
	type ICreateBarberShopDTO,
} from '@modules/BarberShop/dtos/IcreateBarberShopDTO';
import { CreateBarberShopService } from '@modules/BarberShop/services/createBarberShop/createBarberShopService';
import { DeleteBarberShopService } from '@modules/BarberShop/services/deleteBarberShop/deleteBarberShopService';
import { ListBarberShopsService } from '@modules/BarberShop/services/listBarberShops/listBarberShopsService';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';

export class BarberShopController {
	public async create(
		request: Request<unknown, unknown, ICreateBarberShopDTO>,
		response: Response,
	): Promise<void> {
		const { name, slug, description, email, phone, city, street, state, cep } =
			createBarberShopDTO.parse(request.body);

		const createBarberShopService = container.resolve(CreateBarberShopService);

		await createBarberShopService.execute({
			name,
			slug,
			description,
			email,
			phone,
			city,
			street,
			state,
			cep,
		});

		response.status(201).json({ message: 'Barber shop created successfully' });
	}

	public async delete(
		request: Request<{ id: string }>,
		response: Response,
	): Promise<void> {
		const { id } = z
			.object({
				id: z.uuid(),
			})
			.parse(request.params);

		const deleteBarberShopService = container.resolve(DeleteBarberShopService);

		await deleteBarberShopService.execute(id);

		response.status(204).json();
	}

	public async list(_: Request, response: Response): Promise<void> {
		const listBarberShopsService = container.resolve(ListBarberShopsService);

		const barberShops = await listBarberShopsService.execute();

		response.status(200).json(barberShops);
	}
}
