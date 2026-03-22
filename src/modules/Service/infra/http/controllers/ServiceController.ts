import {
  createServiceBodySchema,
  type ICreateServiceBodyDTO,
} from '@modules/Service/dtos/ICreateServiceDTO';
import {
  type IUpdateServiceDTO,
  updateServiceSchema,
} from '@modules/Service/dtos/IUpdateServiceDTO';
import { CreateServiceService } from '@modules/Service/services/createService/createService.service';
import { DeleteServiceService } from '@modules/Service/services/deleteService/deleteService.service';
import { ListServicesService } from '@modules/Service/services/listServices/listServices.service';
import { UpdateServiceService } from '@modules/Service/services/updateService/updateService.service';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';

export class ServiceController {
  async create(
    request: Request<
      { barberShopIdOrSlug: string },
      unknown,
      ICreateServiceBodyDTO
    >,
    response: Response,
  ) {
    const { barberShopIdOrSlug } = z
      .object({
        barberShopIdOrSlug: z
          .string('BarberShop ID or Slug is invalid')
          .nonempty('BarberShop ID or Slug is required'),
      })
      .parse(request.params);

    const { name, description, price, durationInMinutes } =
      createServiceBodySchema.parse(request.body);

    const createServiceService = container.resolve(CreateServiceService);

    await createServiceService.execute({
      barberShopId: barberShopIdOrSlug,
      name,
      description,
      price,
      durationInMinutes,
    });

    return response.status(201).send();
  }

  async list(
    request: Request<{ barberShopIdOrSlug: string }>,
    response: Response,
  ) {
    const { barberShopIdOrSlug } = z
      .object({
        barberShopIdOrSlug: z
          .string('BarberShop ID or Slug is invalid')
          .nonempty('BarberShop ID or Slug is required'),
      })
      .parse(request.params);

    const listServicesService = container.resolve(ListServicesService);

    const services = await listServicesService.execute(barberShopIdOrSlug);

    return response.status(200).json(services);
  }

  async update(
    request: Request<
      { barberShopIdOrSlug: string; id: string },
      unknown,
      IUpdateServiceDTO
    >,
    response: Response,
  ) {
    const { id } = z
      .object({
        barberShopIdOrSlug: z
          .string('BarberShop ID or Slug is invalid')
          .nonempty('BarberShop ID or Slug is required'),
        id: z.uuid(),
      })
      .parse(request.params);

    const { description, durationInMinutes, name, price } =
      updateServiceSchema.parse(request.body);

    const updateServiceService = container.resolve(UpdateServiceService);

    await updateServiceService.execute(id, {
      description,
      durationInMinutes,
      name,
      price,
    });

    return response.status(204).send();
  }

  async delete(
    request: Request<{ barberShopIdOrSlug: string; id: string }>,
    response: Response,
  ) {
    const { id } = z
      .object({
        barberShopIdOrSlug: z
          .string('BarberShop ID or Slug is invalid')
          .nonempty('BarberShop ID or Slug is required'),
        id: z.uuid(),
      })
      .parse(request.params);

    const deleteServiceService = container.resolve(DeleteServiceService);

    await deleteServiceService.execute(id);

    return response.status(204).send();
  }
}
