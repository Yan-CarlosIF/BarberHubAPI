import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/infra/prisma/client';
import request from 'supertest';

describe('[GET] /services/:barberShopId', () => {
	let superAdminToken: string;
	let adminToken: string;
	let barberShopId: string;

	beforeAll(async () => {
		const response = await request(app).post('/auth/login').send({
			email: 'admin@example.com',
			password: 'hub123',
		});

		superAdminToken = response.body.token;

		await request(app)
			.post('/barber-shop')
			.set('Authorization', `Bearer ${superAdminToken}`)
			.send({
				name: 'Test Barber Shop',
				slug: 'test-barber-shop',
				description: 'test description',
				email: 'test@example.com',
				phone: '(11) 11111-1111',
				city: 'Test City',
				street: 'Test Street',
				state: 'Test State',
				cep: '12345-678',
			});

		const barberShop = await prisma.barberShop.findUnique({
			select: { id: true },
			where: { email: 'test@example.com' },
		});

		barberShopId = barberShop?.id as string;

		await request(app)
			.post(`/users/${barberShopId}/admin`)
			.set('Authorization', `Bearer ${superAdminToken}`)
			.send({
				name: 'Admin User',
				email: 'admin@test.com',
				password: 'admin123',
			});

		const adminLoginResponse = await request(app).post('/auth/login').send({
			email: 'admin@test.com',
			password: 'admin123',
		});

		adminToken = adminLoginResponse.body.token;

		// Create services
		await request(app)
			.post(`/services/${barberShopId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Corte de cabelo',
				description: 'Corte masculino',
				price: 50,
				durationInMinutes: 30,
			});

		await request(app)
			.post(`/services/${barberShopId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Barba',
				description: 'Barba completa',
				price: 30,
				durationInMinutes: 20,
			});
	});

	it('should be able to list services by barber shop', async () => {
		const response = await request(app).get(`/services/${barberShopId}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveLength(2);
		expect(response.body[0]).toHaveProperty('name');
		expect(response.body[0]).toHaveProperty('price');
	});

	it('should not be able to list services for a non-existent barber shop', async () => {
		const response = await request(app).get(`/services/${crypto.randomUUID()}`);

		expect(response.status).toBe(404);
		expect(response.body.message).toBe('Barber shop not found');
	});
});
