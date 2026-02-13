import type { SignOptions } from 'jsonwebtoken';

export const JWT_OPTIONS: SignOptions = {
	algorithm: 'HS256',
	expiresIn: '7d',
	subject: 'user',
};
