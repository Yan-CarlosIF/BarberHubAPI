import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/infra/prisma/client';
import request from 'supertest';

describe('[GET] /users/:barberShopIdOrSlug/admins', () => {
  let superAdminToken: string;
  let barberShopId: string;
  let barberShopSlug: string;

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

    await request(app)
      .post(`/users/${barberShopId}/admin`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        email: 'admin@test.com',
        password: 'hub123',
        name: 'Admin Test',
        barberShopId,
        isActive: true,
      });
  });

  it('should list all admin users for a given barber shop by ID', async () => {
    const response = await request(app)
      .get(`/users/${barberShopId}/admin`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(1);
    expect(response.body[0]).toHaveProperty('email', 'admin@test.com');
  });

  it('should list all admin users for a given barber shop by slug', async () => {
    const response = await request(app)
      .get(`/users/${barberShopSlug}/admin`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toEqual(1);
    expect(response.body[0]).toHaveProperty('email', 'admin@test.com');
  });

  it('should return 404 if barber shop not found', async () => {
    const response = await request(app)
      .get('/users/non-existent-barber-shop/admin')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Barber shop not found');
  });

  it('should not be able to list admins if user not super admin', async () => {
    // Authenticate as a regular admin user to get token
    const loginResponse = await request(app).post('/auth/login').send({
      email: 'admin@test.com',
      password: 'hub123',
    });

    const adminToken = loginResponse.body.token;

    const response = await request(app)
      .get(`/users/${barberShopId}/admin`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty(
      'message',
      'User does not have permission to perform this action',
    );
  });
});
