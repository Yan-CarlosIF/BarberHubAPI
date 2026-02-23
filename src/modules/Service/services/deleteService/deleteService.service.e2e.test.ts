import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/infra/prisma/client';
import request from 'supertest';

describe('[DELETE] /services/:barberShopId/:id', () => {
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
	});

	it('should be able to delete a service', async () => {
		await request(app)
			.post(`/services/${barberShopId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Serviço para deletar',
				description: 'Descrição',
				price: 50,
				durationInMinutes: 30,
			});

		const service = await prisma.service.findFirst({
			where: { name: 'Serviço para deletar' },
		});

		const response = await request(app)
			.delete(`/services/${barberShopId}/${service?.id}`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(response.status).toBe(204);

		const deletedService = await prisma.service.findUnique({
			where: { id: service?.id },
		});

		expect(deletedService).toBeNull();
	});

	it('should not be able to delete a non-existent service', async () => {
		const response = await request(app)
			.delete(`/services/${barberShopId}/${crypto.randomUUID()}`)
			.set('Authorization', `Bearer ${adminToken}`);

		expect(response.status).toBe(404);
		expect(response.body.message).toBe('Service not found');
	});

	it('should not allow non-admin users to delete a service', async () => {
		await request(app).post(`/auth/${barberShopId}/register`).send({
			name: 'Regular User',
			email: 'regular@example.com',
			password: 'regular123',
			phone: '(11) 99999-9999',
			birthDate: '1990-01-01',
		});

		const regularLoginResponse = await request(app).post('/auth/login').send({
			email: 'regular@example.com',
			password: 'regular123',
		});

		const nonAdminToken = regularLoginResponse.body.token;

		await request(app)
			.post(`/services/${barberShopId}`)
			.set('Authorization', `Bearer ${adminToken}`)
			.send({
				name: 'Serviço protegido',
				description: 'Descrição',
				price: 40,
				durationInMinutes: 20,
			});

		const service = await prisma.service.findFirst({
			where: { name: 'Serviço protegido' },
		});

		const response = await request(app)
			.delete(`/services/${barberShopId}/${service?.id}`)
			.set('Authorization', `Bearer ${nonAdminToken}`);

		expect(response.status).toBe(403);
		expect(response.body.message).toBe(
			'User does not have permission to perform this action',
		);
	});
});
