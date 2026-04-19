import { z } from 'zod';

export const listBarberShopsPaginationQuery = z
  .object({
    offset: z.coerce.number().int().min(0).nullish().default(0),
    limit: z.coerce.number().int().positive(),
    search: z.string().nullish(),
  })
  .meta({
    description: 'Query Params para listagem de barbearias com paginação',
  });

export type IListBarberShopsPaginationDTO = z.infer<typeof listBarberShopsPaginationQuery>;
