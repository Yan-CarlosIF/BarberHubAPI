import z from 'zod';

export const registerClientSchema = z
	.object({
		name: z.string(),
		email: z.email(),
		password: z.string().min(6),
		barberShopId: z.uuid(),
		phone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/),
		birthDate: z.coerce.date(),
	})
	.meta({ description: 'Body da requisição para registrar um novo cliente' });

export interface IRegisterClientDTO
	extends z.infer<typeof registerClientSchema> {
	isActive: boolean;
}
