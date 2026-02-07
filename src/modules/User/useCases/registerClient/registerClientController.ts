import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import z from 'zod';
import { RegisterClientUseCase } from './registerClientUseCase';

const registerClientSchema = z.object({
	name: z.string(),
	email: z.email(),
	password: z.string().min(6),
	barberShopId: z.uuid(),
	phone: z.string(),
	birthDate: z.date(),
});

type RegisterClientRequest = z.infer<typeof registerClientSchema>;

export class RegisterClientController {
	async handle(
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
