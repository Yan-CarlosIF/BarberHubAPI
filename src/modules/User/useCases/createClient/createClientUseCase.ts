import { hash } from 'bcrypt';
import { AppError } from '@/shared/errors/appError';
import type { ICreateClientDTO } from '../../dtos/IcreateClientDTO';
import type { IUserRepository } from '../../repository/IuserRepository';

export class CreateClientUseCase {
	constructor(private userRepository: IUserRepository) {}

	async execute(data: ICreateClientDTO): Promise<void> {
		const userAlreadyExists = await this.userRepository.findByEmail(data.email);

		if (userAlreadyExists) {
			throw new AppError('User already exists', 400);
		}

		const hashedPassword = await hash(data.password, 10);

		await this.userRepository.createClient({
			...data,
			password: hashedPassword,
		});
	}
}
