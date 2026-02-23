import {
	createUserSchema,
	type ICreateUserDTO,
} from '@modules/User/dtos/IcreateUserDTO';
import { type ILoginDTO, LoginSchema } from '@modules/User/dtos/ILoginDTO';
import {
	type IRegisterClientDTO,
	registerClientSchema,
} from '@modules/User/dtos/IregisterClientDTO';
import { CreateAdminService } from '@modules/User/services/createAdmin/createAdminService';
import { LoginService } from '@modules/User/services/login/loginService';
import { RegisterClientService } from '@modules/User/services/registerClient/registerClientService';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import z from 'zod';

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
		request: Request<
			Pick<IRegisterClientDTO, 'barberShopId'>,
			unknown,
			Omit<IRegisterClientDTO, 'barberShopId' | 'isActive'>
		>,
		response: Response,
	) {
		const { name, birthDate, email, password, phone } = registerClientSchema
			.omit({
				barberShopId: true,
				isActive: true,
			})
			.parse(request.body);

		const { barberShopId } = z
			.object({
				barberShopId: z
					.uuid('Barbershop ID is invalid')
					.nonempty('Barbershop ID is required'),
			})
			.parse(request.params);

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

	public async createAdminHandle(
		request: Request<
			{ barberShopId: string },
			unknown,
			Omit<ICreateUserDTO, 'isActive' | 'barberShopId'>
		>,
		response: Response,
	) {
		const { name, email, password } = createUserSchema
			.omit({ isActive: true, barberShopId: true })
			.parse(request.body);

		const { barberShopId } = z
			.object({
				barberShopId: z
					.uuid('Barbershop ID is invalid')
					.nonempty('Barbershop ID is required'),
			})
			.parse(request.params);

		const createAdminService = container.resolve(CreateAdminService);

		await createAdminService.execute({
			name,
			email,
			password,
			barberShopId,
			isActive: true,
		});

		return response
			.status(201)
			.json({ message: 'Admin registered successfully' });
	}
}
