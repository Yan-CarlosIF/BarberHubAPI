import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from './appError';

export async function errorHandler(
	error: Error,
	_request: Request,
	response: Response,
	_next: NextFunction,
) {
	if (error instanceof AppError) {
		return response.status(error.statusCode).json({
			message: error.message,
		});
	}

	if (error instanceof ZodError) {
		const zodIssues = JSON.parse(error.message) as ZodError['issues'];

		return response.status(400).json({
			message: zodIssues[0].message,
		});
	}

	console.error(error);
	return response.status(500).json({
		message: 'Internal Server Error',
	});
}
