import { hash } from 'bcrypt';
import { inject, injectable } from 'tsyringe';
import { AppError } from '@/shared/errors/appError';
import type { IRegisterClientDTO } from '../../dtos/IregisterClientDTO';
import type { IUserRepository } from '../../repository/IuserRepository';

@injectable()
export class RegisterClientService {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,
	) {}

	async execute(data: IRegisterClientDTO): Promise<void> {
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
