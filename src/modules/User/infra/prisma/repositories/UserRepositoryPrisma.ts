import type { ICreateBarberDTO } from '@modules/Barber/dtos/ICreateBarberDTO';
import type { IUpdateBarberDTO } from '@modules/Barber/dtos/IUpdateBarberDTO';
import type { Barber } from '@modules/Barber/infra/prisma/entities/Barber';
import type { BarberShop } from '@modules/BarberShop/infra/prisma/entities/BarberShop';
import type { ICreateUserDTO } from '@modules/User/dtos/IcreateUserDTO';
import type { IRegisterClientDTO } from '@modules/User/dtos/IregisterClientDTO';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { $Enums } from '@prisma/client';
import { prisma } from '@shared/infra/prisma/client';
import type { User } from '../entities/User';

export class UserRepositoryPrisma implements IUserRepository {
  async createClient(data: IRegisterClientDTO): Promise<void> {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        barberShopId: data.barberShopId,
        role: $Enums.Role.CLIENT,
        isActive: true,
        client: {
          create: {
            phone: data.phone,
            birthDate: data.birthDate,
            barberShopId: data.barberShopId,
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

  async listBarbersByBarbershop(barberShopId: string): Promise<Barber[]> {
    return await prisma.barber.findMany({
      where: { barberShopId },
      include: {
        user: true,
      },
    });
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
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        barberShop: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.barberShop;
  }
}
