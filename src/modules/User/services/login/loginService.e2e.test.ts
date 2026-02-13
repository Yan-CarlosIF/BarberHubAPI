import { app } from '@shared/infra/http/app';
import request from 'supertest';

describe('[POST] /auth/login', () => {
	it('should authenticate user and return a token', async () => {
		const reponse = await request(app).post('/auth/login').send({
			email: 'admin@example.com',
			password: 'hub123',
		});

		expect(reponse.status).toBe(200);
		expect(reponse.body).toHaveProperty('token');
	});

	it('should return 401 for invalid credentials', async () => {
		const reponse = await request(app).post('/auth/login').send({
			email: 'invalid@example.com',
			password: 'wrongpassword',
		});

		expect(reponse.status).toBe(401);
		expect(reponse.body).toHaveProperty('message', 'Invalid credentials');
	});
});
