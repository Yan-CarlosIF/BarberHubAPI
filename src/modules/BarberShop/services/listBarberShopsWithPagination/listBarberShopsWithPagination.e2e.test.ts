import { app } from '@shared/infra/http/app';
import request from 'supertest';

describe('List Barber Shops with Pagination', () => {
  let superAdminToken: string;

  beforeAll(async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'admin@example.com',
      password: 'hub123',
    });

    superAdminToken = response.body.token;

    for (let i = 0; i < 20; i++) {
      await request(app)
        .post('/barber-shop')
        .set('Authorization', `Bearer ${superAdminToken}`)
        .send({
          name: `Test Barber Shop ${i}`,
          slug: `test-barber-shop-${i}`,
          description: 'test description',
          email: `test${i}@example.com`,
          phone: `(11) 11111-111${i}`,
          city: `Test City ${i}`,
          street: `Test Street ${i}`,
          state: `Test State ${i}`,
          cep: `12345-678${i}`,
        });
    }
  });

  it('should be able to list the barber shops with pagination', async () => {
    const response = await request(app)
      .get('/barber-shop?limit=5&offset=0')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(20);
    expect(response.body.items).toHaveLength(5);
    expect(response.body.items[0].name).toBe('Test Barber Shop 0');
    expect(response.body.items[4].name).toBe('Test Barber Shop 4');
  });

  it('should be able to list the barber shops with pagination and search', async () => {
    const response = await request(app)
      .get('/barber-shop?limit=5&offset=0&search=Test Barber Shop 1')
      .set('Authorization', `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(11);
    expect(response.body.items).toHaveLength(5);
    expect(response.body.items[0].name).toBe('Test Barber Shop 1');
    expect(response.body.items[1].name).toBe('Test Barber Shop 10');
    expect(response.body.items[2].name).toBe('Test Barber Shop 11');
    expect(response.body.items[3].name).toBe('Test Barber Shop 12');
    expect(response.body.items[4].name).toBe('Test Barber Shop 13');
  });

  it('should be able to list the barber shops without authentication', async () => {
    const response = await request(app).get('/barber-shop?limit=5&offset=0');

    expect(response.status).toBe(200);
    expect(response.body.total).toBe(20);
    expect(response.body.items).toHaveLength(5);
    expect(response.body.items[0].name).toBe('Test Barber Shop 0');
    expect(response.body.items[4].name).toBe('Test Barber Shop 4');
  });
});
