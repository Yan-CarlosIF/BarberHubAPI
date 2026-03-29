import z from 'zod';

export const listBarbersPaginationParams = z
  .object({
    barberShopIdOrSlug: z
      .string('Barbershop Id or Slug is invalid')
      .nonempty('Barbershop Id or Slug is required'),
  })
  .meta({ description: 'Parâmetros para listagem de barbeiros com paginação' });

export const listBarbersPaginationQuery = z
  .object({
    offset: z.coerce.number().int().min(0).nullish().default(0),
    limit: z.coerce.number().int().positive(),
  })
  .meta({
    description: 'Query Params para listagem de barbeiros com paginação',
  });

export const ListBarberPaginationDTO = z.intersection(
  listBarbersPaginationParams,
  listBarbersPaginationQuery,
);

export type IListBarbersPaginationDTO = z.infer<typeof ListBarberPaginationDTO>;
export type ListBarbersQuery = z.infer<typeof listBarbersPaginationQuery>;
export type ListBarbersParams = z.infer<typeof listBarbersPaginationParams>;
