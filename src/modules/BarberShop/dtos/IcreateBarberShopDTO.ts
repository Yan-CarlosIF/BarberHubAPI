import z from 'zod';

export const createBarberShopDTO = z
	.object({
		name: z.string(),
		slug: z.string(),
		description: z.string(),
		email: z.email(),
		phone: z
			.string()
			.regex(
				/^\(\d{2}\) \d{4,5}-\d{4}$/,
				'Telefone inválido. Formato esperado: (11) 11111-1111',
			),
		city: z.string(),
		street: z.string(),
		state: z.string(),
		cep: z
			.string()
			.regex(/^\d{5}-\d{3}$/, 'CEP inválido. Formato esperado: 12345-678'),
	})
	.meta({ description: 'Body da requisição para criar uma barbearia' });

export interface ICreateBarberShopDTO
	extends z.infer<typeof createBarberShopDTO> {}
