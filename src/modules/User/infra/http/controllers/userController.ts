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
import { ListBarbersService } from '@modules/User/services/listBarbers/listBarbersService';
import { LoginService } from '@modules/User/services/login/loginService';
import { RegisterClientService } from '@modules/User/services/registerClient/registerClientService';
import { AppError } from '@shared/errors/appError';
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

	public async createBarberHandle(
		request: Request<
			Pick<ICreateBarberDTO, 'barberShopId'>,
			unknown,
			Omit<ICreateBarberDTO, 'isActive' | 'barberShopId'>
		>,
		response: Response,
	) {
		const { name, email, password, specialty } = createBarberSchema
			.omit({ isActive: true, barberShopId: true })
			.parse(request.body);

		const { barberShopId } = z
			.object({
				barberShopId: z
					.uuid('Barbershop ID is invalid')
					.nonempty('Barbershop ID is required'),
			})
			.parse(request.params);

		const createBarberService = container.resolve(CreateBarberService);

		await createBarberService.execute({
			name,
			barberShopId,
			email,
			password,
			isActive: true,
			specialty,
		});

		return response
			.status(201)
			.json({ message: 'Barber registered successfully' });
	}

	public async listBarbersHandle(
		request: Request<{ barberShopId: string }>,
		response: Response,
	) {
		const { barberShopId } = z
			.object({ barberShopId: z.uuid('Barbershop ID is invalid') })
			.parse(request.params);

		if (!barberShopId) {
			throw new AppError('BarberShopId is required', 400);
		}

		const listBarbersService = container.resolve(ListBarbersService);

		const barbers = await listBarbersService.execute(barberShopId);

		return response.status(200).json(barbers);
	}
}
