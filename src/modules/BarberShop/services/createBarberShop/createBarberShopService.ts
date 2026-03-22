import type { ICreateBarberShopDTO } from '@modules/BarberShop/dtos/IcreateBarberShopDTO';
import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateBarberShopService {
  constructor(
    @inject('BarberShopRepository')
    private barberShopRepository: IBarberShopRepository,
  ) {}

  public async execute(data: ICreateBarberShopDTO) {
    const emailAlreadyTaken = await this.barberShopRepository.findByEmail(
      data.email,
    );

    if (emailAlreadyTaken) {
      throw new AppError('Email already registered', 400);
    }

    const slugAlreadyTaken = await this.barberShopRepository.findBySlug(
      data.slug,
    );

    if (slugAlreadyTaken) {
      throw new AppError('Slug already registered', 400);
    }

    const phoneAlreadyTaken = await this.barberShopRepository.findByPhone(
      data.phone,
    );

    if (phoneAlreadyTaken) {
      throw new AppError('Phone number already registered', 400);
    }

    await this.barberShopRepository.create(data);
  }
}
