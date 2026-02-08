import { env } from '@config/env';
import { JWT_OPTIONS } from '@config/jwtOptions';
import type { ILoginDTO } from '@modules/User/dtos/ILoginDTO';
import type { IUserRepository } from '@modules/User/repository/IuserRepository';
import { AppError } from '@shared/errors/appError';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

@injectable()
export class LoginService {
	constructor(
		@inject('UserRepository') private userRepository: IUserRepository,
	) {}

	async execute({ email, password }: ILoginDTO) {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			throw new AppError('Invalid credentials', 401);
		}

		const passwordMatch = await compare(password, user.password);

		if (!passwordMatch) {
			throw new AppError('Invalid credentials', 401);
		}

		const token = sign(
			{
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
					barberShopId: user.barberShopId,
				},
			},
			env.JWT_SECRET,
			JWT_OPTIONS,
		);

		return token;
	}
}
