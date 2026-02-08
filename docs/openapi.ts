import { createBarberShopDTO } from '@modules/BarberShop/dtos/IcreateBarberShopDTO';
import { registerClientSchema } from '@modules/User/dtos/IregisterClientDTO';
import { createDocument } from 'zod-openapi';

export const openApiDocument = createDocument({
	openapi: '3.1.0',
	info: {
		title: 'BarberHub API',
		version: '1.0.0',
		description: 'Documentação da API do BarberHub',
	},
	servers: [{ url: 'http://localhost:3333', description: 'Local' }],
	paths: {
		'/auth/register': {
			post: {
				summary: 'Registrar Cliente',
				tags: ['User'],
				requestBody: {
					content: {
						'application/json': {
							schema: registerClientSchema,
						},
					},
				},
				responses: {
					201: {
						description: 'Cliente registrado com sucesso',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message: 'Client registered successfully',
									},
								},
							},
						},
					},
					400: {
						description: 'Email já registrado',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message: 'Email already registered',
									},
								},
							},
						},
					},
				},
			},
		},
		'/barber-shop': {
			post: {
				summary: 'Registrar Barbearia',
				tags: ['BarberShop'],
				requestBody: {
					content: {
						'application/json': {
							schema: createBarberShopDTO,
						},
					},
				},
				responses: {
					201: {
						description: 'Barbearia registrada com sucesso',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message: 'Barber shop registered successfully',
									},
								},
							},
						},
					},
					400: {
						description: 'Email ou telefone já registrado',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message: 'Email already registered',
									},
								},
							},
						},
					},
				},
			},
		},
	},
	components: {},
});
