import {
	type IRegisterClientDTO,
	registerClientSchema,
} from '@modules/User/dtos/IregisterClientDTO';
import { RegisterClientService } from '@modules/User/services/registerClient/registerClientService';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';

export class UserController {
	public async registerClientHandle(
		request: Request<unknown, unknown, IRegisterClientDTO>,
		response: Response,
	) {
		const { name, barberShopId, birthDate, email, password, phone } =
			registerClientSchema.parse(request.body);

		const registerClientService = container.resolve(RegisterClientService);

		await registerClientService.execute({
			name,
			barberShopId,
			birthDate,
			email,
			password,
			phone,
			isActive: true,
		});

		return response
			.status(201)
			.json({ message: 'Client registered successfully' });
	}
}
