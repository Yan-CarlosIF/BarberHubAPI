import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import type { Barber } from '@modules/User/infra/prisma/entities/Barber';
import { mapUserWithoutPassword } from '@modules/User/mapper/User.mapper';
import type { IUserRepository } from '@modules/User/repository/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListBarbersService {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,
		@inject('BarberShopRepository')
		private barberShopRepository: IBarberShopRepository,
	) {}

	async execute(barberShopId: string) {
		const barberShopExists =
			await this.barberShopRepository.findById(barberShopId);

		if (!barberShopExists) {
			throw new AppError('BarberShop not found', 404);
		}

		const barbers =
			await this.userRepository.listBarbersByBarbershop(barberShopId);

		const barbersWithoutPassword = barbers.map((barber: Barber) => ({
			...barber,
			user: mapUserWithoutPassword(barber.user),
		}));

		return barbersWithoutPassword;
	}
}
