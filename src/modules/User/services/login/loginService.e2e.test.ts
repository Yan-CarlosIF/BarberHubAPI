import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/prisma/client';
import request from 'supertest';
import { seed } from '../../../../../prisma/seed';

describe('[POST] /login', () => {
	beforeAll(async () => {
		await seed()
			.then(() => {
				console.log('Database seeded successfully');
			})
			.catch((error) => {
				console.error('Error seeding database:', error);
			})
			.finally(async () => {
				prisma.$disconnect();
			});
	});

	it('should authenticate user and return a token', async () => {
		const reponse = await request(app).post('/login').send({
			email: 'admin@example.com',
			password: 'hub123',
		});

		expect(reponse.status).toBe(200);
		expect(reponse.body).toHaveProperty('token');
	});

	it('should return 401 for invalid credentials', async () => {
		const reponse = await request(app).post('/login').send({
			email: 'invalid@example.com',
			password: 'wrongpassword',
		});

		expect(reponse.status).toBe(401);
		expect(reponse.body).toHaveProperty('message', 'Invalid credentials');
	});
});
