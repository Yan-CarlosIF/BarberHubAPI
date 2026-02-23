import { z } from 'zod';

export const assignBarberServiceBodySchema = z
	.object({
		serviceId: z.uuid('ID do serviço é inválido'),
	})
	.meta({ description: 'Body para associar um serviço a um barbeiro' });

export type IAssignBarberServiceBodyDTO = z.infer<
	typeof assignBarberServiceBodySchema
>;

export const assignBarberServiceSchema = z.object({
	barberId: z.uuid(),
	serviceId: z.uuid(),
});

export type IAssignBarberServiceDTO = z.infer<typeof assignBarberServiceSchema>;
