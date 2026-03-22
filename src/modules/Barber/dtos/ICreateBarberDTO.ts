import z from 'zod';

export const createBarberSchema = z
	.object({
		name: z.string().min(1, 'Nome é obrigatório'),
		email: z.email('Email inválido'),
		password: z.string().min(6, 'Senha deve conter pelo menos 6 caracteres'),
		barberShopId: z.uuid('Barbershop ID is invalid'),
		isActive: z.boolean().optional().default(true),
		specialty: z.string().optional(),
	})
	.meta({ description: 'Body para criação de barbeiro' });

export const createBarberBody = z.object({
	name: z.string().min(1, 'Nome é obrigatório'),
	email: z.email('Email inválido'),
	password: z.string().min(6, 'Senha deve conter pelo menos 6 caracteres'),
	specialty: z.string().optional(),
});

export interface ICreateBarberDTO extends z.infer<typeof createBarberSchema> {}
