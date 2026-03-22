import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { AppError } from '@shared/errors/appError';
import { isValidUUID } from '@utils/isValidUUID';
import { inject, injectable } from 'tsyringe';

@injectable()
export class GetBarberShopService {
  constructor(
    @inject('BarberShopRepository')
    private barberShopRepository: IBarberShopRepository,
  ) {}

  async execute(idOrSlug: string) {
    const barberShop = isValidUUID(idOrSlug)
      ? await this.barberShopRepository.findById(idOrSlug)
      : await this.barberShopRepository.findBySlug(idOrSlug);

    if (!barberShop) {
      throw new AppError('Barber shop not found', 404);
    }

    return barberShop;
  }
}
