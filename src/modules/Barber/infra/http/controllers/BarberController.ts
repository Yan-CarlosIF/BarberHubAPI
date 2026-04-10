import {
  assignBarberServiceBodySchema,
  type IAssignBarberServiceBodyDTO,
} from '@modules/Barber/dtos/IAssignBarberServiceDTO';
import {
  createBarberAvailabilityBodySchema,
  type ICreateBarberAvailabilityBodyDTO,
} from '@modules/Barber/dtos/ICreateBarberAvailabilityDTO';
import {
  createBarberBlockBodySchema,
  type ICreateBarberBlockBodyDTO,
} from '@modules/Barber/dtos/ICreateBarberBlockDTO';
import {
  createBarberSchema,
  type ICreateBarberDTO,
} from '@modules/Barber/dtos/ICreateBarberDTO';
import {
  type IUpdateBarberDTO,
  updateBarberSchema,
} from '@modules/Barber/dtos/IUpdateBarberDTO';
import { AssignBarberServiceService } from '@modules/Barber/services/assignBarberService/assignBarberServiceService';
import { CreateBarberService } from '@modules/Barber/services/createBarber/createBarberService';
import { CreateBarberBlockService } from '@modules/Barber/services/createBarberBlock/createBarberBlockService';
import { DeleteBarberService } from '@modules/Barber/services/deleteBarber/deleteBarberService';
import { DeleteBarberAvailabilityService } from '@modules/Barber/services/deleteBarberAvailability/deleteBarberAvailabilityService';
import { DeleteBarberBlockService } from '@modules/Barber/services/deleteBarberBlock/deleteBarberBlockService';
import { ListBarberAvailabilityService } from '@modules/Barber/services/listBarberAvailability/listBarberAvailabilityService';
import { ListBarberBlocksService } from '@modules/Barber/services/listBarberBlocks/listBarberBlocksService';
import { ListBarberPaginationService } from '@modules/Barber/services/listBarberPagination/listBarberPaginationService';
import { ListBarberServicesService } from '@modules/Barber/services/listBarberServices/listBarberServicesService';
import { ListBarbersService } from '@modules/Barber/services/listBarbers/listBarbersService';
import { SetBarberAvailabilityService } from '@modules/Barber/services/setBarberAvailability/setBarberAvailabilityService';
import { UnassignBarberServiceService } from '@modules/Barber/services/unassignBarberService/unassignBarberServiceService';
import { UpdateBarberService } from '@modules/Barber/services/updateBarber/updateBarberService';
import {
  type ListBarbersParams,
  type ListBarbersQuery,
  listBarbersPaginationParams,
  listBarbersPaginationQuery,
} from '@modules/User/dtos/IListBarbersPaginationDTO';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import { z } from 'zod';

const barberIdParam = z.object({ barberId: z.uuid() });
const barberAndBlockParams = z.object({
  barberId: z.uuid(),
  blockId: z.uuid(),
});
const barberAndServiceParams = z.object({
  barberId: z.uuid(),
  serviceId: z.uuid(),
});

export class BarberController {
  // ── Barber CRUD ───────────────────────────────────────────

  async createBarberHandle(
    request: Request<
      { barberShopIdOrSlug: string },
      unknown,
      Omit<ICreateBarberDTO, 'isActive' | 'barberShopId'>
    >,
    response: Response,
  ) {
    const { name, email, password, specialty } = createBarberSchema
      .omit({ isActive: true, barberShopId: true })
      .parse(request.body);

    const { barberShopIdOrSlug } = z
      .object({
        barberShopIdOrSlug: z
          .string('Barbershop ID is invalid')
          .nonempty('Barbershop ID is required'),
      })
      .parse(request.params);

    const createBarberService = container.resolve(CreateBarberService);

    await createBarberService.execute({
      name,
      barberShopId: barberShopIdOrSlug,
      email,
      password,
      isActive: true,
      specialty,
    });

    return response
      .status(201)
      .json({ message: 'Barber registered successfully' });
  }

  async deleteBarberHandle(
    request: Request<{ barberShopIdOrSlug: string; id: string }>,
    response: Response,
  ) {
    const { id } = z
      .object({
        barberShopIdOrSlug: z
          .string('Barbershop ID is invalid')
          .nonempty('Barbershop ID is required'),
        id: z.uuid('Barber ID is invalid'),
      })
      .parse(request.params);

    const deleteBarberService = container.resolve(DeleteBarberService);

    await deleteBarberService.execute(id);

    return response.status(204).send();
  }

  async updateBarberHandle(
    request: Request<
      { barberShopIdOrSlug: string; id: string },
      unknown,
      Omit<IUpdateBarberDTO, 'id'>
    >,
    response: Response,
  ) {
    const { id } = z
      .object({
        barberShopIdOrSlug: z
          .string('Barbershop ID or Slug is invalid')
          .nonempty('Barbershop ID or Slug is required'),
        id: z.uuid('Barber ID is invalid'),
      })
      .parse(request.params);

    const { isActive, email, name, password, specialty } = updateBarberSchema
      .omit({ id: true })
      .parse(request.body);

    const updateBarberService = container.resolve(UpdateBarberService);

    await updateBarberService.execute({
      isActive,
      email,
      name,
      password,
      specialty,
      id,
    });

    return response.status(204).send();
  }

  async listBarbersHandle(
    request: Request<{ barberShopIdOrSlug: string }>,
    response: Response,
  ) {
    const { barberShopIdOrSlug } = z
      .object({
        barberShopIdOrSlug: z
          .string('Barbershop Id or Slug is invalid')
          .nonempty('Barbershop Id or Slug is required'),
      })
      .parse(request.params);

    const listBarbersService = container.resolve(ListBarbersService);

    const barbers = await listBarbersService.execute(barberShopIdOrSlug);

    return response.status(200).json(barbers);
  }

  async listBarbersPaginationHandle(
    request: Request<ListBarbersParams, unknown, unknown, ListBarbersQuery>,
    response: Response,
  ) {
    const { barberShopIdOrSlug } = listBarbersPaginationParams.parse(
      request.params,
    );

    const { offset, limit, search } =
      listBarbersPaginationQuery.parse(request.query);

    const listBarbersPaginationService = container.resolve(
      ListBarberPaginationService,
    );

    const paginationData = await listBarbersPaginationService.execute({
      barberShopIdOrSlug,
      limit,
      offset,
      search,
    });

    return response.status(200).json(paginationData);
  }

  // ── Availability ──────────────────────────────────────────

  async setAvailability(
    request: Request<
      { barberId: string },
      unknown,
      ICreateBarberAvailabilityBodyDTO
    >,
    response: Response,
  ) {
    const { barberId } = barberIdParam.parse(request.params);
    const { weekDay, startTime, endTime } =
      createBarberAvailabilityBodySchema.parse(request.body);

    const service = container.resolve(SetBarberAvailabilityService);

    await service.execute({ barberId, weekDay, startTime, endTime });

    return response
      .status(201)
      .json({ message: 'Availability set successfully' });
  }

  async listAvailability(
    request: Request<{ barberId: string }>,
    response: Response,
  ) {
    const { barberId } = barberIdParam.parse(request.params);

    const service = container.resolve(ListBarberAvailabilityService);
    const availabilities = await service.execute(barberId);

    return response.status(200).json(availabilities);
  }

  async deleteAvailability(
    request: Request<{ barberId: string }>,
    response: Response,
  ) {
    const { barberId } = barberIdParam.parse(request.params);

    const service = container.resolve(DeleteBarberAvailabilityService);
    await service.execute(barberId);

    return response.status(204).send();
  }

  // ── Blocks ────────────────────────────────────────────────

  async createBlock(
    request: Request<{ barberId: string }, unknown, ICreateBarberBlockBodyDTO>,
    response: Response,
  ) {
    const { barberId } = barberIdParam.parse(request.params);
    const { date, startTime, endTime } = createBarberBlockBodySchema.parse(
      request.body,
    );

    const service = container.resolve(CreateBarberBlockService);

    await service.execute({ barberId, date, startTime, endTime });

    return response.status(201).json({ message: 'Block created successfully' });
  }

  async listBlocks(request: Request<{ barberId: string }>, response: Response) {
    const { barberId } = barberIdParam.parse(request.params);

    const service = container.resolve(ListBarberBlocksService);
    const blocks = await service.execute(barberId);

    return response.status(200).json(blocks);
  }

  async deleteBlock(
    request: Request<{ barberId: string; blockId: string }>,
    response: Response,
  ) {
    const { barberId, blockId } = barberAndBlockParams.parse(request.params);

    const service = container.resolve(DeleteBarberBlockService);
    await service.execute(barberId, blockId);

    return response.status(204).send();
  }

  // ── BarberService (assign/unassign services) ─────────────

  async assignService(
    request: Request<
      { barberId: string },
      unknown,
      IAssignBarberServiceBodyDTO
    >,
    response: Response,
  ) {
    const { barberId } = barberIdParam.parse(request.params);
    const { serviceId } = assignBarberServiceBodySchema.parse(request.body);

    const service = container.resolve(AssignBarberServiceService);

    await service.execute({ barberId, serviceId });

    return response
      .status(201)
      .json({ message: 'Service assigned successfully' });
  }

  async unassignService(
    request: Request<{ barberId: string; serviceId: string }>,
    response: Response,
  ) {
    const { barberId, serviceId } = barberAndServiceParams.parse(
      request.params,
    );

    const service = container.resolve(UnassignBarberServiceService);
    await service.execute(barberId, serviceId);

    return response.status(204).send();
  }

  async listServices(
    request: Request<{ barberId: string }>,
    response: Response,
  ) {
    const { barberId } = barberIdParam.parse(request.params);

    const service = container.resolve(ListBarberServicesService);
    const services = await service.execute(barberId);

    return response.status(200).json(services);
  }
}
