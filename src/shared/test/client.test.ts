import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

export function createTestPrismaClient(databaseUrl: string, schema = 'test') {
	const pool = new Pool({
		connectionString: databaseUrl,
	});

	// Forçar search_path em TODAS as conexões (necessário para raw queries)
	pool.on('connect', (client) => {
		client.query(`SET search_path TO ${schema}, public`);
	});

	// Prisma 7: o parâmetro ?schema= da URL não funciona mais para queries.
	// É necessário passar { schema } como opção do PrismaPg.
	const adapter = new PrismaPg(pool, { schema });

	const prisma = new PrismaClient({
		adapter,
		log: ['query', 'error', 'warn'],
		errorFormat: 'pretty',
	});

	return { prisma, pool };
}
