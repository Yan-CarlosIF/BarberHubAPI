import { z } from 'zod';

export const updateScheduleStatusBodySchema = z
	.object({
		status: z.enum(['COMPLETED', 'CANCELED', 'NO_SHOW'], {
			message: 'Status inválido',
		}),
	})
	.meta({ description: 'Body para atualizar o status de um agendamento' });

export type IUpdateScheduleStatusBodyDTO = z.infer<
	typeof updateScheduleStatusBodySchema
>;

export const updateScheduleStatusSchema = z.object({
	id: z.uuid(),
	status: z.enum(['COMPLETED', 'CANCELED', 'NO_SHOW']),
});

export type IUpdateScheduleStatusDTO = z.infer<
	typeof updateScheduleStatusSchema
>;
