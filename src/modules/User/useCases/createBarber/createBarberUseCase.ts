import type { ICreateBarberDTO } from '@modules/User/dtos/IcreateBarberDTO';
import type { IUserRepository } from '@modules/User/repository/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { hash } from 'bcrypt';

export class CreateBarberUseCase {
	constructor(private userRepository: IUserRepository) {}

	async execute(data: ICreateBarberDTO): Promise<void> {
		const userAlreadyExists = await this.userRepository.findByEmail(data.email);

		if (userAlreadyExists) {
			throw new AppError('User already exists', 400);
		}

		const hashedPassword = await hash(data.password, 10);

		await this.userRepository.createBarber({
			...data,
			password: hashedPassword,
		});
	}
}
