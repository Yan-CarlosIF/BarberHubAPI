import type { ICreateBarberDTO } from '@modules/User/dtos/IcreateBarberDTO';
import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CreateBarberService {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,
	) {}

	async execute(data: ICreateBarberDTO): Promise<void> {
		const userAlreadyExists = await this.userRepository.findByEmail(data.email);

		if (userAlreadyExists) {
			throw new AppError('Email already registered', 400);
		}

		const hashedPassword = await hash(data.password, 10);

		await this.userRepository.createBarber({
			...data,
			password: hashedPassword,
		});
	}
}
