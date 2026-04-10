import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import type { IListBarbersPaginationDTO } from '@modules/User/dtos/IListBarbersPaginationDTO';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { isValidUUID } from '@utils/isValidUUID';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListBarberPaginationService {
  constructor(
    @inject('BarberShopRepository')
    private barberShopRepository: IBarberShopRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    barberShopIdOrSlug,
    offset = 0,
    limit,
    search,
  }: IListBarbersPaginationDTO) {
    const barberShop = isValidUUID(barberShopIdOrSlug)
      ? await this.barberShopRepository.findById(barberShopIdOrSlug)
      : await this.barberShopRepository.findBySlug(barberShopIdOrSlug);

    if (!barberShop) {
      throw new AppError('Barber shop not found', 404);
    }

    const { items, ...rest } =
      await this.userRepository.listBarbersByBarbershopPagination(
        barberShop.id,
        limit,
        offset ?? 0,
        search,
      );

    return {
      barbers: items,
      ...rest,
    };
  }
}
