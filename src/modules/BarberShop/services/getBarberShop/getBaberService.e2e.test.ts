import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/infra/prisma/client';
import request from 'supertest';

describe('[DELETE] /barber-shop/:barberShopIdOrSlug', () => {
  let superAdminToken: string;
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
      });

    const barberShop = await prisma.barberShop.findUnique({
      where: { email: 'test@example.com' },
    });

    barberShopId = barberShop?.id as string;
    barberShopSlug = barberShop?.slug as string;
  });

  it('should be able to get a barber shop by id', async () => {
    const response = await request(app)
      .get(`/barber-shop/${barberShopId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', barberShopId);
  });

  it('should be able to get a barber shop by slug', async () => {
    const response = await request(app)
      .get(`/barber-shop/${barberShopSlug}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('slug', barberShopSlug);
  });

  it('should not be able to get a non existing barber shop', async () => {
    const response = await request(app)
      .get('/barber-shop/non-existing-id')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Barber shop not found');
  });
});
