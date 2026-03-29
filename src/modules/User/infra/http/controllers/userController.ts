import {
  createUserSchema,
  type ICreateUserDTO,
} from '@modules/User/dtos/IcreateUserDTO';
import { type ILoginDTO, LoginSchema } from '@modules/User/dtos/ILoginDTO';
import {
  type IRegisterClientDTO,
  registerClientSchema,
} from '@modules/User/dtos/IregisterClientDTO';
import { CreateAdminService } from '@modules/User/services/createAdmin/createAdminService';
import { DeleteAdminService } from '@modules/User/services/deleteAdmin/deleteAdminService';
import { ListAdminsService } from '@modules/User/services/listAdmins/listAdminsService';
import { LoginService } from '@modules/User/services/login/loginService';
import { RegisterClientService } from '@modules/User/services/registerClient/registerClientService';
import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import z from 'zod';

export class UserController {
  public async loginHandle(
    request: Request<unknown, unknown, ILoginDTO>,
    response: Response,
  ) {
    const { email, password } = LoginSchema.parse(request.body);

    const loginService = container.resolve(LoginService);

    const token = await loginService.execute({ email, password });

    return response.json({ token });
  }

  public async registerClientHandle(
    request: Request<
      { barberShopIdOrSlug: string },
      unknown,
      Omit<IRegisterClientDTO, 'barberShopId' | 'isActive'>
    >,
    response: Response,
  ) {
    const { name, birthDate, email, password, phone } = registerClientSchema
      .omit({
        barberShopId: true,
        isActive: true,
      })
      .parse(request.body);

    const { barberShopIdOrSlug } = z
      .object({
        barberShopIdOrSlug: z
          .string('Barbershop ID or Slug is invalid')
          .nonempty('Barbershop ID or Slug is required'),
      })
      .parse(request.params);

    const registerClientService = container.resolve(RegisterClientService);

    await registerClientService.execute({
      name,
      barberShopId: barberShopIdOrSlug,
      birthDate,
      email,
      password,
      phone,
      isActive: true,
    });

    return response
      .status(201)
      .json({ message: 'Client registered successfully' });
  }

  public async listAdminsHandle(
    request: Request<{ barberShopIdOrSlug: string }>,
    response: Response,
  ) {
    const { barberShopIdOrSlug } = z
      .object({
        barberShopIdOrSlug: z
          .string('Barbershop ID or Slug is invalid')
          .nonempty('Barbershop ID or Slug is required'),
      })
      .parse(request.params);

    const listAdminsService = container.resolve(ListAdminsService);

    const admins = await listAdminsService.execute(barberShopIdOrSlug);

    return response.json(admins);
  }

  public async createAdminHandle(
    request: Request<
      { barberShopIdOrSlug: string },
      unknown,
      Omit<ICreateUserDTO, 'isActive' | 'barberShopId'>
    >,
    response: Response,
  ) {
    const { name, email, password } = createUserSchema
      .omit({ isActive: true, barberShopId: true })
      .parse(request.body);

    const { barberShopIdOrSlug } = z
      .object({
        barberShopIdOrSlug: z
          .string('Barbershop ID or Slug is invalid')
          .nonempty('Barbershop ID or Slug is required'),
      })
      .parse(request.params);

    const createAdminService = container.resolve(CreateAdminService);

    await createAdminService.execute({
      name,
      email,
      password,
      barberShopId: barberShopIdOrSlug,
      isActive: true,
    });

    return response
      .status(201)
      .json({ message: 'Admin registered successfully' });
  }

  public async deleteAdminHandle(
    request: Request<{ adminId: string }>,
    response: Response,
  ) {
    const { adminId } = z
      .object({
        adminId: z
          .string('Admin ID is invalid')
          .nonempty('Admin ID is required'),
      })
      .parse(request.params);

    const deleteAdminService = container.resolve(DeleteAdminService);

    await deleteAdminService.execute(adminId);

    return response.status(204).send();
  }
}
