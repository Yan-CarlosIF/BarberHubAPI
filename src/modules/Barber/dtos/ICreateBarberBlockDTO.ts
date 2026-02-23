import { z } from 'zod';

export const createBarberBlockBodySchema = z
	.object({
		date: z.string().date('Data inválida (formato esperado: YYYY-MM-DD)'),
		startTime: z
			.string()
			.regex(/^\d{2}:\d{2}$/, 'Horário inválido (formato esperado: HH:MM)'),
		endTime: z
			.string()
			.regex(/^\d{2}:\d{2}$/, 'Horário inválido (formato esperado: HH:MM)'),
	})
	.meta({ description: 'Body para bloquear horário do barbeiro' });

export type ICreateBarberBlockBodyDTO = z.infer<
	typeof createBarberBlockBodySchema
>;

export const createBarberBlockSchema = z.object({
	barberId: z.uuid(),
	date: z.string().date(),
	startTime: z.string().regex(/^\d{2}:\d{2}$/),
	endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export type ICreateBarberBlockDTO = z.infer<typeof createBarberBlockSchema>;
