import { type ILoginDTO, LoginSchema } from '@modules/User/dtos/ILoginDTO';
import {
	type IRegisterClientDTO,
	registerClientSchema,
} from '@modules/User/dtos/IregisterClientDTO';
import { LoginService } from '@modules/User/services/login/loginService';
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

	public async loginHandle(
		request: Request<unknown, unknown, ILoginDTO>,
		response: Response,
	) {
		const { email, password } = LoginSchema.parse(request.body);

		const loginService = container.resolve(LoginService);

		const token = await loginService.execute({ email, password });

		return response.json({ token });
	}
}
