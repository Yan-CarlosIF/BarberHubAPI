import {
	createBarberSchema,
	type ICreateBarberDTO,
} from '@modules/User/dtos/IcreateBarberDTO';
import { type ILoginDTO, LoginSchema } from '@modules/User/dtos/ILoginDTO';
import {
	type IRegisterClientDTO,
	registerClientSchema,
} from '@modules/User/dtos/IregisterClientDTO';
import { CreateBarberService } from '@modules/User/services/createBarber/createBarberService';
import { LoginService } from '@modules/User/services/login/loginService';
import { RegisterClientService } from '@modules/User/services/registerClient/registerClientService';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';

export class UserController {
	public async loginHandle(
		request: Request<unknown, unknown, ILoginDTO>,
		response: Response,
	) {
		const { email, password } = LoginSchema.parse(request.body);

		const loginService = container.resolve(LoginService);

		const token = await loginService.execute({ email, password });

		return response.json({ token });
	}

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

	public async createBarberHandle(
		request: Request<unknown, unknown, ICreateBarberDTO>,
		response: Response,
	) {
		const { name, barberShopId, email, password, isActive, specialty } =
			createBarberSchema.parse(request.body);

		const createBarberService = container.resolve(CreateBarberService);

		await createBarberService.execute({
			name,
			barberShopId,
			email,
			password,
			isActive,
			specialty,
		});

		return response
			.status(201)
			.json({ message: 'Barber registered successfully' });
	}
}
