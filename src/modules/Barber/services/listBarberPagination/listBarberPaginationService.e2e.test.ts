import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/infra/prisma/client';
import request from 'supertest';

describe('[GET] /barbers/:barberShopIdOrSlug/pagination', () => {
  let superAdminToken: string;
  let barberShopId: string;
  let barberShopSlug: string;

  beforeAll(async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'admin@example.com',
      password: 'hub123',
    });

    superAdminToken = response.body.token;

    // Create a barber shop
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

    // Create multiple barbers for pagination testing
    for (let i = 0; i < 15; i++) {
      await request(app)
        .post(`/barbers/${barberShopId}`)
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          name: `Barber ${i}`,
          email: `barber${i}@example.com`,
          phone: `(11) 11111-111${i.toString().padStart(2, '0')}`,
          password: 'password',
          specialty: 'Corte de cabelo',
        });
    }
  });

  it('should list barbers with pagination', async () => {
    const response = await request(app)
      .get(`/barbers/${barberShopSlug}/pagination?limit=10`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('barbers');
    expect(response.body.barbers.length).toBe(10);
    expect(response.body).toHaveProperty('total', 15);
    expect(response.body).toHaveProperty('lastPage', 2);
    expect(response.body).toHaveProperty('page', 1);
    expect(response.body).toHaveProperty('limit', 10);
  });

  it('should return 404 for non-existent barber shop', async () => {
    const response = await request(app)
      .get('/barbers/non-existent-shop/pagination?limit=10')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Barber shop not found');
  });
});
