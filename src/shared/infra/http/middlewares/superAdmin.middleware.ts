import { AppError } from '@shared/errors/appError';
import type { NextFunction, Request, Response } from 'express';

export function superAdminMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	if (req.user?.role !== 'SUPER_ADMIN') {
		throw new AppError(
			'User does not have permission to perform this action',
			403,
		);
	}

	return next();
}
