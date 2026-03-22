import type { Barber } from '@modules/Barber/infra/prisma/entities/Barber';
import type { IBarberShopRepository } from '@modules/BarberShop/repositories/IBarberShopRepository';
import { mapUserWithoutPassword } from '@modules/User/mapper/User.mapper';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { isValidUUID } from '@utils/isValidUUID';
import { inject, injectable } from 'tsyringe';

@injectable()
export class ListBarbersService {
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
			throw new AppError('BarberShop not found', 404);
		}

		const barbers = await this.userRepository.listBarbersByBarbershop(
			barberShopExists.id,
		);

		const barbersWithoutPassword = barbers.map((barber: Barber) => ({
			...barber,
			user: mapUserWithoutPassword(barber.user),
		}));

		return barbersWithoutPassword;
	}
}
