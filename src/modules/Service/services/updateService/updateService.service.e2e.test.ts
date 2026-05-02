import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/infra/prisma/client';
import request from 'supertest';

describe('[PATCH] /services/:barberShopId/:id', () => {
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
        latitude: -23.55052,
        longitude: -46.633308,
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

  it('should be able to update a service', async () => {
    await request(app)
      .post(`/services/${barberShopId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Corte de cabelo',
        description: 'Corte masculino',
        price: 50,
        durationInMinutes: 30,
      });

    const service = await prisma.service.findFirst({
      where: { name: 'Corte de cabelo' },
    });

    const response = await request(app)
      .patch(`/services/${barberShopId}/${service?.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Corte atualizado',
        price: 60,
      });

    const updatedService = await prisma.service.findUnique({
      where: { id: service?.id },
    });

    expect(response.status).toBe(204);
    expect(updatedService?.name).toBe('Corte atualizado');
    expect(Number(updatedService?.price)).toBe(60);
  });

  it('should be able to update a service using barberShop slug', async () => {
    await request(app)
      .post(`/services/${barberShopSlug}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Corte de cabelo',
        description: 'Corte masculino',
        price: 50,
        durationInMinutes: 30,
      });

    const service = await prisma.service.findFirst({
      where: { name: 'Corte de cabelo' },
    });

    const response = await request(app)
      .patch(`/services/${barberShopSlug}/${service?.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Corte atualizado',
        price: 60,
      });

    const updatedService = await prisma.service.findUnique({
      where: { id: service?.id },
    });

    expect(response.status).toBe(204);
    expect(updatedService?.name).toBe('Corte atualizado');
    expect(Number(updatedService?.price)).toBe(60);
  });

  it('should not be able to update a non-existent service', async () => {
    const response = await request(app)
      .patch(`/services/${barberShopId}/${crypto.randomUUID()}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated',
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Service not found');
  });

  it('should not allow non-admin users to update a service', async () => {
    await request(app).post(`/auth/register`).send({
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

    const service = await prisma.service.findFirst();

    const response = await request(app)
      .patch(`/services/${barberShopId}/${service?.id}`)
      .set('Authorization', `Bearer ${nonAdminToken}`)
      .send({
        name: 'Should Not Update',
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'User does not have permission to perform this action',
    );
  });
});
