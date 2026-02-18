import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/infra/prisma/client';
import request from 'supertest';

describe('[POST] /users/:barberShopId/admin', () => {
	let superAdminToken: string;

	beforeAll(async () => {
		// Authenticate as super admin to get token
		const response = await request(app).post('/auth/login').send({
			email: 'admin@example.com',
			password: 'hub123',
		});

		superAdminToken = response.body.token;

		// Create a barber shop to associate with the admin user
		await request(app)
			.post('/barber-shop')
			.set('Authorization', `Bearer ${superAdminToken}`)
			.send({
				name: 'Test Barber Shop',
				description: 'test description',
				email: 'test@example.com',
				phone: '(11) 11111-1111',
				city: 'Test City',
				street: 'Test Street',
				state: 'Test State',
				cep: '12345-678',
			});
	});

	it('should create a new admin user', async () => {
		const barberShop = await prisma.barberShop.findUnique({
			where: { email: 'test@example.com' },
		});

		const response = await request(app)
			.post(`/users/${barberShop?.id}/admin`)
			.set('Authorization', `Bearer ${superAdminToken}`)
			.send({
				email: 'admin1@example.com',
				password: 'admin123',
				name: 'Admin User',
			});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty(
			'message',
			'Admin registered successfully',
		);
	});

	it('should not allow non-superadmin users to create an admin', async () => {
		const barberShop = await prisma.barberShop.findUnique({
			where: { email: 'test@example.com' },
		});

		const responseLogin = await request(app).post('/auth/login').send({
			email: 'admin1@example.com',
			password: 'admin123',
		});

		const token = responseLogin.body.token;

		const response = await request(app)
			.post(`/users/${barberShop?.id}/admin`)
			.set('Authorization', `Bearer ${token}`)
			.send({
				email: 'admin2@example.com',
				password: 'admin456',
				name: 'Admin User',
			});

		expect(response.status).toBe(403);
		expect(response.body).toHaveProperty(
			'message',
			'User does not have permission to perform this action',
		);
	});
});
