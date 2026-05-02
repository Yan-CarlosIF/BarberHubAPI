import { app } from '@shared/infra/http/app';
import { prisma } from '@shared/infra/prisma/client';
import request from 'supertest';

describe('[DELETE] /users/admins/:adminId', () => {
  let superAdminToken: string;
  let adminId: string;
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
        latitude: -23.55052,
        longitude: -46.633308,
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

    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@test.com' },
      select: { id: true },
    });

    adminId = adminUser?.id as string;
  });

  it('should delete an admin user successfully', async () => {
    const response = await request(app)
      .delete(`/users/${barberShopSlug}/admin/${adminId}`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    // Verify the admin user is deleted
    const deletedAdmin = await prisma.user.findUnique({
      where: { id: adminId },
    });

    expect(response.status).toBe(204);
    expect(deletedAdmin).toBeNull();
  });

  it('should return 404 if admin user does not exist', async () => {
    const response = await request(app)
      .delete(`/users/${barberShopSlug}/admin/nonexistent-admin-id`)
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toEqual('User not found');
  });

  it('should not be able to delete a admin if user not a super admin', async () => {
    // Create a non-super admin user
    await request(app)
      .post(`/users/${barberShopId}/admin`)
      .set('Authorization', `Bearer ${superAdminToken}`)
      .send({
        email: 'user@test.com',
        password: 'hub123',
        name: 'User Test',
        barberShopId,
        isActive: true,
      });

    const adminLoginResponse = await request(app).post('/auth/login').send({
      email: 'user@test.com',
      password: 'hub123',
    });

    const userToken = adminLoginResponse.body.token;

    const response = await request(app)
      .delete(`/users/${barberShopSlug}/admin/${adminId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(403);
    expect(response.body.message).toBe(
      'User does not have permission to perform this action',
    );
  });
});
