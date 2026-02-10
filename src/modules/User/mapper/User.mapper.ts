import type { User } from '../infra/prisma/entities/User';

export function mapUserWithoutPassword(user: User): Omit<User, 'password'> {
	const { password, ...safeUser } = user;
	return safeUser;
}
