import z from 'zod';

export const registerClientSchema = z
	.object({
		name: z.string().min(1, 'Nome é obrigatório'),
		email: z.email('Email inválido'),
		password: z.string().min(6, 'Senha deve conter pelo menos 6 caracteres'),
		barberShopId: z.uuid(),
		phone: z
			.string()
			.regex(
				/^\(\d{2}\) \d{4,5}-\d{4}$/,
				'Telefone deve estar no formato (XX) XXXXX-XXXX',
			),
		birthDate: z.coerce.date(),
	})
	.meta({ description: 'Body da requisição para registrar um novo cliente' });

export interface IRegisterClientDTO
	extends z.infer<typeof registerClientSchema> {
	isActive: boolean;
}
