import type { IUserRepository } from '@modules/User/repositories/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class DeleteBarberService {
	constructor(
		@inject('UserRepository')
		private userRepository: IUserRepository,
	) {}

	async execute(id: string) {
		const userExists = await this.userRepository.findById(id);

		if (!userExists) {
			throw new AppError('Barber not found', 404);
		}

		await this.userRepository.delete(id);
	}
}
