import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { mapUserWithoutPassword } from '@modules/User/mapper/User.mapper';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { isValidUUID } from '@utils/isValidUUID';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListAdminsService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('BarberShopRepository')
    private barberShopRepository: IBarberShopRepository,
  ) {}

  async execute(barberShopIdOrSlug: string) {
    const barberShopExists = isValidUUID(barberShopIdOrSlug)
      ? await this.barberShopRepository.findById(barberShopIdOrSlug)
      : await this.barberShopRepository.findBySlug(barberShopIdOrSlug);

    if (!barberShopExists) {
      throw new AppError('Barber shop not found', 404);
    }

    const admins = await this.userRepository.listAdminsByBarbershop(
      barberShopExists.id,
    );

    console.log(admins);

    console.log(admins.map((admin) => mapUserWithoutPassword(admin)));

    return admins.map((admin) => mapUserWithoutPassword(admin));
  }
}
