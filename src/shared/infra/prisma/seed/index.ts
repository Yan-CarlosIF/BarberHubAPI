import { prisma } from '../client';
import { seed } from './script';

async function main() {
	await prisma.$connect();

	seed(prisma)
		.then(async () => {
			console.log('✅ Database seeding completed successfully!');
			await prisma.$disconnect();
		})
		.catch(async (e) => {
			console.error('❌ Error seeding database: ', e);
			await prisma.$disconnect();
			process.exit(1);
		});
}

main();
