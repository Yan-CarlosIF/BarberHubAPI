import { prisma } from '@shared/prisma/client';
import { hash } from 'bcrypt';

export async function seed() {
	await prisma.$connect();
	console.log('Seeding super admin user...');

	const hashedPassword = await hash('hub123', 10);

	await prisma.user.create({
		data: {
			email: 'admin@example.com',
			name: 'Super Admin',
			role: 'SUPER_ADMIN',
			password: hashedPassword,
			isActive: true,
		},
	});

	console.log('Seeding completed.');
}

seed()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
