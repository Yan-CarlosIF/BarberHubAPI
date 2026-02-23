import { z } from 'zod';

export const createScheduleBodySchema = z
	.object({
		barberId: z.uuid('ID do barbeiro é inválido'),
		serviceId: z.uuid('ID do serviço é inválido'),
		date: z.string().date('Data inválida (formato esperado: YYYY-MM-DD)'),
		startTime: z
			.string()
			.regex(/^\d{2}:\d{2}$/, 'Horário inválido (formato esperado: HH:MM)'),
	})
	.meta({ description: 'Body para criar um novo agendamento' });

export type ICreateScheduleBodyDTO = z.infer<typeof createScheduleBodySchema>;

export const createScheduleSchema = z.object({
	barberShopId: z.uuid(),
	clientId: z.uuid(),
	barberId: z.uuid(),
	serviceId: z.uuid(),
	date: z.string().date(),
	startTime: z.string().regex(/^\d{2}:\d{2}$/),
	endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export type ICreateScheduleDTO = z.infer<typeof createScheduleSchema>;
