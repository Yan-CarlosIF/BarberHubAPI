import type { $Enums } from '@prisma/client';
import { AppError } from '@shared/errors/appError';
import type { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
	user: {
		id: string;
		name: string;
		email: string;
		role: $Enums.Role;
		barberShopId?: string;
	};
}

export function authMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	const { authorization } = req.headers;

	if (!authorization) {
		throw new AppError('Usuário não autorizado', 401);
	}

	const [, token] = authorization.split(' ');

	try {
		const { user } = verify(
			token,
			process.env.JWT_SECRET as string,
		) as ITokenPayload;

		req.user = user;

		return next();
	} catch {
		throw new AppError('Usuário não autorizado', 401);
	}
}
