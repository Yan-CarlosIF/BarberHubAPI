import type { IUpdateBarberDTO } from '@modules/User/dtos/IUpdateBarberDTO';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UpdateBarberService {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,
	) {}

	async execute({
		id,
		email,
		isActive,
		name,
		password,
		specialty,
	}: IUpdateBarberDTO) {
		const barber = await this.userRepository.findById(id);

		if (!barber) {
			throw new AppError('Barber not found', 404);
		}

		if (email) {
			const emailAlreadyTaken = await this.userRepository.findByEmail(email);

			if (emailAlreadyTaken) {
				throw new AppError('Email already taken', 409);
			}
		}

		if (password) {
			const passwordHash = await hash(password, 8);
			password = passwordHash;
		}

		await this.userRepository.updateBarber({
			id,
			email,
			isActive,
			name,
			password,
			specialty,
		});
	}
}
