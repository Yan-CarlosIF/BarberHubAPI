import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = process.env['DATABASE_URL'];

const adapter = new PrismaPg(new Pool({ connectionString }));

export const prisma = new PrismaClient({
	adapter,
	log: ['query', 'error', 'warn'],
});
