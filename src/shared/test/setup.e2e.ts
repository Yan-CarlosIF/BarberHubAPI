import { execSync } from 'node:child_process';
import { prisma } from '@shared/infra/prisma/client';
import { pool } from '@shared/infra/prisma/connection';
import { seed } from '@shared/infra/prisma/seed/script';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL environment variable is not set');
}

const url = new URL(process.env.DATABASE_URL);
url.searchParams.set('schema', 'test');
process.env.DATABASE_URL = url.toString();

beforeAll(async () => {
	// Limpar e criar schema de teste
	await pool.query('DROP SCHEMA IF EXISTS "test" CASCADE');
	await pool.query('CREATE SCHEMA IF NOT EXISTS "test"');

	// Criar schema de teste e aplicar migrações
	execSync('npx prisma db push', {
		env: {
			...process.env,
			NODE_ENV: 'test',
			DATABASE_URL: process.env.DATABASE_URL,
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
