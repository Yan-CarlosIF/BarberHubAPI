import type { IListBarberShopsPaginationDTO } from '@modules/BarberShop/dtos/IListBarberShopsPaginationDTO';
import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListBarberShopsWithPaginationService {
  constructor(
    @inject('BarberShopRepository')
    private barberShopRepository: IBarberShopRepository,
  ) {}

  async execute({ offset, limit, search }: IListBarberShopsPaginationDTO) {
    const barberShops = await this.barberShopRepository.listPaginated(
      offset ?? 0,
      limit,
      search,
    );

    return barberShops;
  }
}
