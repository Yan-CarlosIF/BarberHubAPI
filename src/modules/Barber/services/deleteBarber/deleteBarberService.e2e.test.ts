import { randomUUID } from 'node:crypto';
import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/infra/prisma/client';
import request from 'supertest';

describe('[DELETE] /barbers/:barberShopId/:id', () => {
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
			where: { email: 'test@example.com' },
		});

		barberShopId = barberShop?.id as string;

		// admin from same barber shop
		await request(app)
			.post(`/users/${barberShopId}/admin`)
			.set('Authorization', `Bearer ${superAdminToken}`)
			.send({
				email: 'admin1@example.com',
				password: 'admin123',
				name: 'Admin User',
			});

		const loginAdmin = await request(app).post('/auth/login').send({
			email: 'admin1@example.com',
			password: 'admin123',
		});

		adminToken = loginAdmin.body.token;
	});

	it('should be able to delete a barber', async () => {
		await request(app)
			.post(`/barbers/${barberShopId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Barber to Delete',
				email: 'barberToDelete@example.com',
				password: 'password123',
			});

		const barber = await prisma.user.findUnique({
			where: {
				email: 'barberToDelete@example.com',
			},
		});

		const response = await request(app)
			.delete(`/barbers/${barberShopId}/${barber?.id}`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(response.status).toBe(204);
	});

	it('should not be able to delete a non-existent barber', async () => {
		const response = await request(app)
			.delete(`/barbers/${barberShopId}/${randomUUID()}`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(response.status).toBe(404);
		expect(response.body).toHaveProperty('message', 'Barber not found');
	});

	it('should not allow non-admin users to delete a barber', async () => {
		// creating a barber to be deleted by non-admin user
		await request(app)
			.post(`/barbers/${barberShopId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				name: 'non-admin user',
				email: 'nonAdmin@example.com',
				password: 'password123',
			});

		const nonAdminUserLogin = await request(app).post('/auth/login').send({
			email: 'nonAdmin@example.com',
			password: 'password123',
		});

		const nonAdminToken = nonAdminUserLogin.body.token;

		await request(app)
			.post(`/barbers/${barberShopId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Barber to Delete',
				email: 'barberToDelete@example.com',
				password: 'password123',
			});

		const barber = await prisma.user.findUnique({
			where: {
				email: 'barberToDelete@example.com',
			},
		});

		const response = await request(app)
			.delete(`/barbers/${barberShopId}/${barber?.id}`)
			.set('Authorization', `Bearer ${nonAdminToken}`);

		expect(response.status).toBe(403);
		expect(response.body).toHaveProperty(
			'message',
			'User does not have permission to perform this action',
		);
	});
});
