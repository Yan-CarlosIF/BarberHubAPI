import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/infra/prisma/client';
import request from 'supertest';

describe('createService', () => {
  let superAdminToken: string;
  let adminToken: string;
  let barberShopId: string;
  let barberShopSlug: string;

  beforeAll(async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'admin@example.com',
      password: 'hub123',
    });

    superAdminToken = response.body.token;

    // Create a barber shop and an admin user, then get the admin token
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
      select: { id: true, slug: true },
      where: { email: 'test@example.com' },
    });

    barberShopId = barberShop?.id as string;
    barberShopSlug = barberShop?.slug as string;

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

  it('should be able to create a new service', async () => {
    const response = await request(app)
      .post(`/services/${barberShopId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Service',
        description: 'Test Description',
        price: 100,
        durationInMinutes: 30,
      });

    const services = await prisma.service.findMany();

    expect(response.status).toBe(201);
    expect(services.length).toBe(1);
    expect(services[0].name).toBe('Test Service');
  });

  it('should be able to create a new service using barber shop slug', async () => {
    const response = await request(app)
      .post(`/services/${barberShopSlug}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Service 2',
        description: 'Test Description 2',
        price: 150,
        durationInMinutes: 45,
      });

    const services = await prisma.service.findMany({
      where: { name: 'Test Service 2' },
    });

    expect(response.status).toBe(201);
    expect(services.length).toBe(1);
    expect(services[0].name).toBe('Test Service 2');
  });

  it('should not be able to create a service for a non-existent barber shop', async () => {
    const response = await request(app)
      .post(`/services/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        name: 'Test Service',
        description: 'Test Description',
        price: 100,
        durationInMinutes: 30,
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Barber shop not found');
  });

  it('should not be allowed to create a service if user is not admin', async () => {
    // Creating a non-admin user
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

    const response = await request(app)
      .post(`/services/${barberShopId}`)
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({
        name: 'Test Service',
        description: 'Test Description',
        price: 100,
        durationInMinutes: 30,
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'User does not have permission to perform this action',
    );
  });
});
