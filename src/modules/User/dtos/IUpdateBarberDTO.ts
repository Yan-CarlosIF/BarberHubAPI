import { z } from 'zod';

export const updateBarberSchema = z.object({
	id: z.uuid('ID inválido'),
	name: z.string().min(1, 'Nome é obrigatório').optional(),
	email: z.email('Email inválido').optional(),
	password: z
		.string()
		.min(6, 'Senha deve conter pelo menos 6 caracteres')
		.optional(),
	isActive: z.boolean().optional().default(true),
	specialty: z.string().optional(),
});

export interface IUpdateBarberDTO extends z.infer<typeof updateBarberSchema> {}
