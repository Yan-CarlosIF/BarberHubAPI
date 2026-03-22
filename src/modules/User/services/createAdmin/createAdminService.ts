import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import type { ICreateUserDTO } from '@modules/User/dtos/IcreateUserDTO';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { isValidUUID } from '@utils/isValidUUID';
import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateAdminService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('BarberShopRepository')
    private barberShopRepository: IBarberShopRepository,
  ) {}

  async execute({
    barberShopId,
    email,
    isActive,
    name,
    password,
  }: ICreateUserDTO): Promise<void> {
    if (!barberShopId) {
      throw new AppError('Barber shop ID is required', 400);
    }

    const barberShopExists = isValidUUID(barberShopId)
      ? await this.barberShopRepository.findById(barberShopId)
      : await this.barberShopRepository.findBySlug(barberShopId);

    if (!barberShopExists) {
      throw new AppError('Barber shop not found', 404);
    }

    const emailAlreadyTaken = await this.userRepository.findByEmail(email);

    if (emailAlreadyTaken) {
      throw new AppError('Email already taken', 400);
    }

    const hashedPassword = await hash(password, 10);

    await this.userRepository.createAdmin({
      barberShopId: barberShopExists.id,
      email,
      isActive,
      name,
      password: hashedPassword,
    });
  }
}
