import { execSync } from 'node:child_process';
import { seed } from '@shared/prisma/seed/script';
import { createTestPrismaClient } from './client.test';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL environment variable is not set');
}

// Modificar a URL do banco de dados para usar um schema de teste
const url = new URL(process.env.DATABASE_URL);
url.searchParams.set('schema', 'test');

const databaseUrl = url.toString();
process.env.DATABASE_URL = databaseUrl;
console.log(`Using test database URL: ${databaseUrl}`);

const { prisma, pool } = createTestPrismaClient(databaseUrl);

beforeAll(async () => {
	// Limpar e criar schema de teste
	await pool.query('DROP SCHEMA IF EXISTS "test" CASCADE');
	await pool.query('CREATE SCHEMA IF NOT EXISTS "test"');

	// Criar schema de teste e aplicar migrações
	execSync('npx prisma db push', {
		env: {
			...process.env,
			NODE_ENV: 'test',
			DATABASE_URL: databaseUrl,
		},
		stdio: 'inherit',
	});

	await prisma.$connect(); // Garantir que a conexão está estabelecida antes de semear os dados

	// Popular o banco de dados de teste com dados iniciais
	await seed(prisma)
		.then(() => {
			console.log('✅ Database seeded successfully on test setup');
		})
		.catch(async (error) => {
			console.error('❌ Error seeding database on test setup:', error);
			await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "test" CASCADE`);
			await prisma.$disconnect();
			throw error;
		});
});

afterAll(async () => {
	// Limpar o schema de teste após os testes
	try {
		await prisma.$executeRawUnsafe('DROP SCHEMA IF EXISTS "test" CASCADE');
	} catch (error) {
		console.error('Error dropping test schema:', error);
	} finally {
		await prisma.$disconnect();
	}
});
