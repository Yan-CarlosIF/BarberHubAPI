import { env } from '@config/env';
import { AppError } from '@shared/errors/appError';
import type { NextFunction, Request, Response } from 'express';

export function adminMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	if (req.user.role === 'SUPER_ADMIN') {
		return next();
	}

	if (env.NODE_ENV === 'development') {
		console.log(
			req.user.role === 'ADMIN' ? 'Usuário é ADMIN' : 'Usuário não é ADMIN',
			'\n',
			req.user?.barberShopId
				? `Usuário pertence à barbearia ${req.user.barberShopId}`
				: 'Usuário não pertence a nenhuma barbearia',
			'\n',
			req.params?.barberShopId
				? `Requisição para barbearia ${req.params.barberShopId}`
				: 'Requisição sem barbearia específica',
		);
	}

	const userBarberShopId = req.user?.barberShopId;
	const userBarberShopSlug = req.user?.barberShopSlug;
	const paramsBarberShopIdOrSlug = req.params?.barberShopIdOrSlug;
	const isUserAdmin = req.user.role === 'ADMIN';

	if (isUserAdmin && userBarberShopId === paramsBarberShopIdOrSlug) {
		return next();
	}

	if (userBarberShopSlug === paramsBarberShopIdOrSlug) {
		return next();
	}

	throw new AppError(
		'User does not have permission to perform this action',
		403,
	);
}
