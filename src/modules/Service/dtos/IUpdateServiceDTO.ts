import type { z } from 'zod';
import { createServiceBodySchema } from './ICreateServiceDTO';

export const updateServiceSchema = createServiceBodySchema
	.partial()
	.meta({ description: 'Body para atualização de um serviço' });

export type IUpdateServiceDTO = z.infer<typeof updateServiceSchema>;
