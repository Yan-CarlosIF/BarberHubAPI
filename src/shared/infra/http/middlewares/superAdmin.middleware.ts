import { AppError } from '@shared/errors/appError';
import type { NextFunction, Request, Response } from 'express';

export function superAdminMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	if (req.user.role !== 'SUPER_ADMIN') {
		throw new AppError('Acesso negado', 403);
	}

	return next();
}
