import type { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

export async function seed(prisma: PrismaClient) {
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
}
