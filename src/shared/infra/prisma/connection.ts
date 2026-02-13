import 'dotenv/config';
import { env } from '@config/env';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = env.DATABASE_URL;

export const pool = new Pool({ connectionString });

export default new PrismaPg(pool, {
	schema: env.NODE_ENV === 'test' ? 'test' : 'public',
});
