import type { ICreateBarberShopDTO } from '@modules/BarberShop/dtos/IcreateBarberShopDTO';
import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { Decimal } from '@prisma/client/runtime/client';
import { prisma } from '@shared/infra/prisma/client';
import type { IOffsetPaginationReturn } from '@utils/IPagination';
import type { BarberShop } from '../entities/BarberShop';

export class BarberShopPrismaRepository implements IBarberShopRepository {
  async create({
    latitude,
    longitude,
    ...data
  }: ICreateBarberShopDTO): Promise<void> {
    await prisma.barberShop.create({
      data: {
        ...data,
        latitude: new Decimal(latitude),
        longitude: new Decimal(longitude),
      },
    });
  }

  async list(): Promise<BarberShop[]> {
    return await prisma.barberShop.findMany();
  }

  async delete(id: string): Promise<void> {
    await prisma.barberShop.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<BarberShop | null> {
    return await prisma.barberShop.findUnique({
      where: { id },
    });
  }

  async findByPhone(phone: string): Promise<BarberShop | null> {
    return await prisma.barberShop.findUnique({
      where: { phone },
    });
  }

  async findByEmail(email: string): Promise<BarberShop | null> {
    return await prisma.barberShop.findUnique({
      where: { email },
    });
  }

  async findBySlug(slug: string): Promise<BarberShop | null> {
    return await prisma.barberShop.findUnique({
      where: { slug },
    });
  }

  async listPaginated(
    offset: number,
    limit: number,
    search?: string | null,
  ): Promise<IOffsetPaginationReturn<BarberShop>> {
    // Construir filtros do Prisma
    const where: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [total, data] = await prisma.$transaction([
      prisma.barberShop.count({
        where,
      }),
      prisma.barberShop.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
        where,
      }),
    ]);

    return {
      total,
      items: data,
      page: Math.floor(offset / limit) + 1,
      limit,
      lastPage: Math.ceil(total / limit),
    };
  }
}
