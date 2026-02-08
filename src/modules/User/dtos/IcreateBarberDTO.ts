import z from 'zod';

const createBarberSchema = z
	.object({
		name: z.string().min(1, 'Nome é obrigatório'),
		email: z.email('Email inválido'),
		password: z.string().min(6, 'Senha deve conter pelo menos 6 caracteres'),
		barberShopId: z.uuid(),
		isActive: z.boolean().optional().default(true),
		specialty: z.string().optional(),
	})
	.meta({ description: 'Body para criação de barbeiro' });

export interface ICreateBarberDTO extends z.infer<typeof createBarberSchema> {}
