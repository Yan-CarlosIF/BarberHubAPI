import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),
	DATABASE_URL: z.url(),
	REDIS_URL: z.url(),
	JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
});

function validate() {
	const parse = envSchema.safeParse({
		NODE_ENV: process.env.NODE_ENV,
		DATABASE_URL: process.env.DATABASE_URL,
		REDIS_URL: process.env.REDIS_URL,
		JWT_SECRET: process.env.JWT_SECRET,
	});

	if (!parse.success) {
		const errors = z.treeifyError(parse.error);

		console.error('Invalid environment variables:', errors);
		throw new Error('Invalid environment variables');
	}

	return parse.data;
}

export const env = validate();
