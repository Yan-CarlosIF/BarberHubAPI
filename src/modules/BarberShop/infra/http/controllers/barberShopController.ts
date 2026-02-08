import {
	createBarberShopDTO,
	type ICreateBarberShopDTO,
} from '@modules/BarberShop/dtos/IcreateBarberShopDTO';
import { CreateBarberShopService } from '@modules/BarberShop/services/createBarberShop/createBarberShopService';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';

export class BarberShopController {
	public async create(
		request: Request<unknown, unknown, ICreateBarberShopDTO>,
		response: Response,
	): Promise<void> {
		const { name, description, email, phone, city, street, state, cep } =
			createBarberShopDTO.parse(request.body);

		const createBarberShopService = container.resolve(CreateBarberShopService);

		await createBarberShopService.execute({
			name,
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
}
