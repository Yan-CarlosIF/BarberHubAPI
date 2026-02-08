import { RegisterClientUseCase } from '@modules/User/useCases/registerClient/registerClientUseCase';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import z from 'zod';

export const registerClientSchema = z
	.object({
		name: z.string(),
		email: z.email(),
		password: z.string().min(6),
		barberShopId: z.uuid(),
		phone: z.string(),
		birthDate: z.date(),
	})
	.meta({ description: 'Body da requisição para registrar um novo cliente' });

type RegisterClientRequest = z.infer<typeof registerClientSchema>;

export class UserController {
	public async registerClientHandle(
		request: Request<unknown, unknown, RegisterClientRequest>,
		response: Response,
	) {
		const { name, barberShopId, birthDate, email, password, phone } =
			registerClientSchema.parse(request.body);

		const registerClientUseCase = container.resolve(RegisterClientUseCase);

		await registerClientUseCase.execute({
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
