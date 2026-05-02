import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/infra/prisma/client';
import request from 'supertest';

describe('[PATCH] /barbers/:barberShopId/:id', () => {
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

  it('should be able to update a barber successfully', async () => {
    // First, create a barber to update
    await request(app)
      .post(`/barbers/${barberShopId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Barber One',
        email: 'barberone@test.com',
        password: 'barber123',
      });

    const barber = await prisma.user.findUnique({
      where: { email: 'barberone@test.com' },
    });

    const response = await request(app)
      .patch(`/barbers/${barberShopId}/${barber?.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Barber',
        email: 'updatedbarber@test.com',
        specialty: 'Haircut',
      });

    const updatedBarber = await prisma.user.findUnique({
      where: { email: 'updatedbarber@test.com' },
      include: { barber: true },
    });

    expect(response.status).toBe(204);
    expect(updatedBarber?.name).toBe('Updated Barber');
    expect(updatedBarber?.email).toBe('updatedbarber@test.com');
    expect(updatedBarber?.barber?.specialty).toBe('Haircut');
  });

  it('should be able to update a barber using slug instead of ID', async () => {
    const barber = await prisma.user.findUnique({
      where: { email: 'updatedbarber@test.com' },
    });

    const response = await request(app)
      .patch(`/barbers/${barberShopSlug}/${barber?.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Updated Barber 2',
        email: 'updated2barber@test.com',
        specialty: 'Beard Trim',
      });

    const updatedBarber = await prisma.user.findUnique({
      where: { email: 'updated2barber@test.com' },
      include: { barber: true },
    });

    expect(response.status).toBe(204);
    expect(updatedBarber?.name).toBe('Updated Barber 2');
    expect(updatedBarber?.email).toBe('updated2barber@test.com');
    expect(updatedBarber?.barber?.specialty).toBe('Beard Trim');
  });

  it('should not allow updating a barber with an email that already exists', async () => {
    // Create another barber to test email conflict
    await request(app)
      .post(`/barbers/${barberShopId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Barber Two',
        email: 'barbertwo@test.com',
        password: 'barber123',
      });

    const barber = await prisma.user.findUnique({
      where: { email: 'barbertwo@test.com' },
    });

    const response = await request(app)
      .patch(`/barbers/${barberShopId}/${barber?.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'updated2barber@test.com', // Try to update to an existing email
      });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already taken');
  });

  it('should not allow a non-admin user to update a barber', async () => {
    // Create a non-admin user
    const nonAdminResponse = await request(app).post('/auth/login').send({
      email: 'barbertwo@test.com',
      password: 'barber123',
    });

    const barber = await prisma.user.findUnique({
      where: { email: 'barbertwo@test.com' },
    });

    const nonAdminToken = nonAdminResponse.body.token;

    const response = await request(app)
      .patch(`/barbers/${barberShopId}/${barber?.id}`)
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
