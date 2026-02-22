import { z } from 'zod';

export const createServiceBodySchema = z
	.object({
		name: z.string().min(1).max(100),
		description: z.string().max(500).optional(),
		price: z.number().positive(),
		durationInMinutes: z.number().int().positive(),
	})
	.meta({ description: 'Body para criar um novo serviço' });

export type ICreateServiceBodyDTO = z.infer<typeof createServiceBodySchema>;

export const createServiceSchema = z.object({
	barberShopId: z.uuid(),
	name: z.string().min(1).max(100),
	description: z.string().max(500).optional(),
	price: z.number().positive(),
	durationInMinutes: z.number().int().positive(),
});

export type ICreateServiceDTO = z.infer<typeof createServiceSchema>;
