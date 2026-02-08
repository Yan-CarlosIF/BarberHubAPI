import z from 'zod';

export const LoginSchema = z
	.object({
		email: z.email('Email inválido'),
		password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
	})
	.meta({ description: 'Body para login do usuário' });

export interface ILoginDTO extends z.infer<typeof LoginSchema> {}
