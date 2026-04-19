import {
  createBarberShopDTO,
  type ICreateBarberShopDTO,
} from '@modules/BarberShop/dtos/IcreateBarberShopDTO';
import {
  type IListBarberShopsPaginationDTO,
  listBarberShopsPaginationQuery,
} from '@modules/BarberShop/dtos/IListBarberShopsPaginationDTO';
import { CreateBarberShopService } from '@modules/BarberShop/services/createBarberShop/createBarberShopService';
import { DeleteBarberShopService } from '@modules/BarberShop/services/deleteBarberShop/deleteBarberShopService';
import { GetBarberShopService } from '@modules/BarberShop/services/getBarberShop/getBarberShopService';
import { ListBarberShopsService } from '@modules/BarberShop/services/listBarberShops/listBarberShopsService';
import { ListBarberShopsWithPaginationService } from '@modules/BarberShop/services/listBarberShopsWithPagination/listBarberShopsWithPaginationService';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';

export class BarberShopController {
  public async create(
    request: Request<unknown, unknown, ICreateBarberShopDTO>,
    response: Response,
  ): Promise<void> {
    const { name, slug, description, email, phone, city, street, state, cep } =
      createBarberShopDTO.parse(request.body);

    const createBarberShopService = container.resolve(CreateBarberShopService);

    await createBarberShopService.execute({
      name,
      slug,
      description,
      email,
      phone,
      city,
      street,
      state,
      cep,
    });

    response.status(201).json({ message: 'Barber shop created successfully' });
  }

  public async delete(
    request: Request<{ idOrSlug: string }>,
    response: Response,
  ): Promise<void> {
    const { idOrSlug } = z
      .object({
        idOrSlug: z.uuid(),
      })
      .parse(request.params);

    const deleteBarberShopService = container.resolve(DeleteBarberShopService);

    await deleteBarberShopService.execute(idOrSlug);

    response.status(204).json();
  }

  public async list(_: Request, response: Response): Promise<void> {
    const listBarberShopsService = container.resolve(ListBarberShopsService);

    const barberShops = await listBarberShopsService.execute();

    response.status(200).json(barberShops);
  }

  public async listWithPagination(
    request: Request<unknown, unknown, unknown, IListBarberShopsPaginationDTO>,
    response: Response,
  ): Promise<void> {
    const { limit, offset, search } = listBarberShopsPaginationQuery.parse(
      request.query,
    );

    const listBarberShopsWithPaginationService = container.resolve(
      ListBarberShopsWithPaginationService,
    );

    const barberShops = await listBarberShopsWithPaginationService.execute({
      limit,
      offset,
      search,
    });

    response.status(200).json(barberShops);
  }

  public async get(
    request: Request<{ idOrSlug: string }>,
    response: Response,
  ): Promise<void> {
    const { idOrSlug } = z
      .object({
        idOrSlug: z.string(),
      })
      .parse(request.params);

    const getBarberShopService = container.resolve(GetBarberShopService);

    const barberShop = await getBarberShopService.execute(idOrSlug);

    response.status(200).json(barberShop);
  }
}
