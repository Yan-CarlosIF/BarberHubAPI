import type { ICreateBarberDTO } from '@modules/Barber/dtos/ICreateBarberDTO';
import type { IUpdateBarberDTO } from '@modules/Barber/dtos/IUpdateBarberDTO';
import type { Barber } from '@modules/Barber/infra/prisma/entities/Barber';
import type { BarberShop } from '@modules/BarberShop/infra/prisma/entities/BarberShop';
import type { ICreateUserDTO } from '@modules/User/dtos/IcreateUserDTO';
import type { IRegisterClientDTO } from '@modules/User/dtos/IregisterClientDTO';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { $Enums } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/client';
import type { IOffsetPaginationReturn } from '@utils/IPagination';
import type { Client } from '../entities/Client';
import type { User } from '../entities/User';

export class UserRepositoryPrisma implements IUserRepository {
  async createClient(data: IRegisterClientDTO): Promise<void> {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        barberShopId: null,
        role: $Enums.Role.CLIENT,
        isActive: true,
        client: {
          create: {
            phone: data.phone,
            birthDate: data.birthDate,
          },
        },
      },
    });
  }

  async createBarber(data: ICreateBarberDTO): Promise<void> {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        barberShopId: data.barberShopId,
        role: $Enums.Role.BARBER,
        isActive: true,
        barber: {
          create: {
            specialty: data.specialty,
            barberShopId: data.barberShopId,
          },
        },
      },
    });
  }

  async createAdmin(data: ICreateUserDTO): Promise<void> {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        barberShopId: data.barberShopId,
        role: $Enums.Role.ADMIN,
        isActive: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async findClientByUserId(userId: string): Promise<Client | null> {
    return await prisma.client.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async listBarbersByBarbershop(barberShopId: string): Promise<Barber[]> {
    return await prisma.barber.findMany({
      where: { barberShopId },
      include: {
        user: true,
      },
    });
  }

  async listBarbersByBarbershopPagination(
    barberShopId: string,
    limit: number,
    offset: number,
    search?: string | null,
  ): Promise<IOffsetPaginationReturn<Barber>> {
    const [items, total] = await prisma.$transaction([
      prisma.barber.findMany({
        where: {
          barberShopId,
          user: {
            name: search
              ? { contains: search, mode: 'insensitive' }
              : undefined,
          },
        },
        include: {
          user: true,
        },
        skip: offset ?? 0,
        take: limit,
      }),
      prisma.barber.count({
        where: {
          barberShopId,
          user: {
            name: search
              ? { contains: search, mode: 'insensitive' }
              : undefined,
          },
        },
      }),
    ]);

    return {
      items,
      total,
      lastPage: Math.ceil(total / limit),
      page: offset !== null ? Math.floor((offset ?? 0) / limit) + 1 : 1,
      limit,
    };
  }

  async listAdminsByBarbershop(barberShopId: string): Promise<User[]> {
    const admins = await prisma.user.findMany({
      where: { barberShopId, role: $Enums.Role.ADMIN },
    });

    return admins;
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async updateBarber({
    id,
    isActive,
    email,
    name,
    password,
    specialty,
  }: IUpdateBarberDTO): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password,
        isActive,
        barber: {
          update: {
            specialty,
          },
        },
      },
    });
  }

  async getUserBarberShop(userId: string): Promise<BarberShop | null> {
    // For ADMIN: barberShop is linked directly via User.barberShopId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        barberShop: true,
        barber: {
          include: {
            barberShop: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    // ADMIN: direct relation
    if (user.barberShop) {
      return user.barberShop;
    }

    // BARBER: via barber table
    if (user.barber?.barberShop) {
      return user.barber.barberShop;
    }

    return null;
  }
}
