import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { isValidUUID } from '@utils/isValidUUID';
import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { AppError } from '@/shared/errors/appError';
import type { IRegisterClientDTO } from '../../dtos/IregisterClientDTO';
import type { IUserRepository } from '../../repositories/IuserRepository';

@injectable()
export class RegisterClientService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('BarberShopRepository')
    private barberShopRepository: IBarberShopRepository,
  ) {}

  async execute(data: IRegisterClientDTO): Promise<void> {
    const barberShopExists = isValidUUID(data.barberShopId)
      ? await this.barberShopRepository.findById(data.barberShopId)
      : await this.barberShopRepository.findBySlug(data.barberShopId);

    if (!barberShopExists) {
      throw new AppError('Barber shop not found', 404);
    }

    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await hash(data.password, 10);

    await this.userRepository.createClient({
      ...data,
      barberShopId: barberShopExists.id,
      password: hashedPassword,
    });
  }
}
