import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { AppError } from '@/shared/errors/appError';
import type { ICreateClientDTO } from '../../dtos/IcreateClientDTO';
import type { IUserRepository } from '../../repository/IuserRepository';

@injectable()
export class RegisterClientUseCase {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,
	) {}

	async execute(data: ICreateClientDTO): Promise<void> {
		const userAlreadyExists = await this.userRepository.findByEmail(data.email);

		if (userAlreadyExists) {
			throw new AppError('Email already registered', 400);
		}

		const hashedPassword = await hash(data.password, 10);

		await this.userRepository.createClient({
			...data,
			password: hashedPassword,
		});
	}
}
