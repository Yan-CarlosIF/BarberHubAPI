import type { SignOptions } from 'jsonwebtoken';

export const JWT_OPTIONS: SignOptions = {
	expiresIn: '7d',
};
