import type { ICreateBarberDTO } from '@modules/Barber/dtos/ICreateBarberDTO';
import type { IUpdateBarberDTO } from '@modules/Barber/dtos/IUpdateBarberDTO';
import type { Barber } from '@modules/Barber/infra/prisma/entities/Barber';
import type { BarberShop } from '@modules/BarberShop/infra/prisma/entities/BarberShop';
import type { IOffsetPaginationReturn } from '@utils/IPagination';
import type { ICreateUserDTO } from '../dtos/IcreateUserDTO';
import type { IRegisterClientDTO } from '../dtos/IregisterClientDTO';
import type { User } from '../infra/prisma/entities/User';

export interface IUserRepository {
  createClient(data: IRegisterClientDTO): Promise<void>;
  createBarber(data: ICreateBarberDTO): Promise<void>;
  createAdmin(data: ICreateUserDTO): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  getUserBarberShop(userId: string): Promise<BarberShop | null>;
  listBarbersByBarbershop(barberShopId: string): Promise<Barber[]>;
  listBarbersByBarbershopPagination(
    barberShopId: string,
    limit: number,
    offset: number,
    search?: string | null,
  ): Promise<IOffsetPaginationReturn<Barber>>;
  listAdminsByBarbershop(barberShopId: string): Promise<User[]>;
  delete(id: string): Promise<void>;
  updateBarber(data: IUpdateBarberDTO): Promise<void>;
}
