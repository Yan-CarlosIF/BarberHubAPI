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

	if (
		req.user.role === 'ADMIN' &&
		req.user?.barberShopId === req.body?.barberShopId
	) {
		return next();
	}

	console.log(
		'Acesso negado porque o usuário é ADMIN, mas não pertence à barbearia',
	);
	throw new AppError('Acesso negado', 403);
}
