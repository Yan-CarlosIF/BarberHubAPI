import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { AppError } from '@shared/errors/appError';
import { isValidUUID } from '@utils/isValidUUID';
import { inject, injectable } from 'tsyringe';
import type { ICreateServiceDTO } from '../../dtos/ICreateServiceDTO';
import type { IServiceRepository } from '../../repositories/IServiceRepository';

@injectable()
export class CreateServiceService {
  constructor(
    @inject('ServiceRepository')
    private serviceRepository: IServiceRepository,
    @inject('BarberShopRepository')
    private barberShopRepository: IBarberShopRepository,
  ) {}

  async execute({
    barberShopId,
    durationInMinutes,
    name,
    price,
    description,
  }: ICreateServiceDTO) {
    const barberShopExists = isValidUUID(barberShopId)
      ? await this.barberShopRepository.findById(barberShopId)
      : await this.barberShopRepository.findBySlug(barberShopId);

    if (!barberShopExists) {
      throw new AppError('Barber shop not found', 404);
    }

    await this.serviceRepository.create({
      barberShopId: barberShopExists.id,
      durationInMinutes,
      name,
      price,
      description,
    });
  }
}
