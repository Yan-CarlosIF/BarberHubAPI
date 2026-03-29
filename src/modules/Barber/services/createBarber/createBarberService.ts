import type { ICreateBarberDTO } from '@modules/Barber/dtos/ICreateBarberDTO';
import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { isValidUUID } from '@utils/isValidUUID';
import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateBarberService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('BarberShopRepository')
    private barberShopRepository: IBarberShopRepository,
  ) {}

  async execute(data: ICreateBarberDTO): Promise<void> {
    const barberShop = isValidUUID(data.barberShopId)
      ? await this.barberShopRepository.findById(data.barberShopId)
      : await this.barberShopRepository.findBySlug(data.barberShopId);

    if (!barberShop) {
      throw new AppError('BarberShop not found', 404);
    }

    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await hash(data.password, 10);

    await this.userRepository.createBarber({
      ...data,
      password: hashedPassword,
      barberShopId: barberShop.id,
    });
  }
}
