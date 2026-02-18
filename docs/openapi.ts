import { createBarberShopDTO } from '@modules/BarberShop/dtos/IcreateBarberShopDTO';
import { createBarberBody } from '@modules/User/dtos/IcreateBarberDTO';
import { createUserSchema } from '@modules/User/dtos/IcreateUserDTO';
import { LoginSchema } from '@modules/User/dtos/ILoginDTO';
import { registerClientBody } from '@modules/User/dtos/IregisterClientDTO';
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
		'/auth/login': {
			post: {
				summary: 'Login de Usuário',
				tags: ['User'],
				requestBody: {
					content: {
						'application/json': {
							schema: LoginSchema,
						},
					},
				},
				responses: {
					200: {
						description: 'Autenticação bem-sucedida',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										token: { type: 'string' },
									},
									example: {
										token: 'jwt_token_here',
									},
								},
							},
						},
					},
					401: {
						description: 'Credenciais inválidas',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message: 'Invalid credentials',
									},
								},
							},
						},
					},
				},
			},
		},
		'/auth/{barberShopId}/register': {
			post: {
				summary: 'Registrar Cliente',
				tags: ['User'],
				parameters: [
					{
						name: 'barberShopId',
						in: 'path',
						required: true,
						schema: { type: 'string', format: 'uuid' },
						description: 'ID da barbearia',
					},
				],
				requestBody: {
					content: {
						'application/json': {
							schema: registerClientBody,
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
		'/users/{barberShopId}/admin': {
			post: {
				summary: 'Registrar Administrador',
				tags: ['User'],
				parameters: [
					{
						name: 'barberShopId',
						in: 'path',
						required: true,
						schema: { type: 'string', format: 'uuid' },
						description: 'ID da barbearia',
					},
				],
				requestBody: {
					content: {
						'application/json': {
							schema: createUserSchema.omit({
								isActive: true,
								barberShopId: true,
							}),
						},
					},
				},
				responses: {
					201: {
						description: 'Administrador registrado com sucesso',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message: 'Admin registered successfully',
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
					403: {
						description: 'Usuário sem permissão para realizar esta ação',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message:
											'User does not have permission to perform this action',
									},
								},
							},
						},
					},
				},
			},
		},
		'/users/{barberShopId}/barbers': {
			get: {
				summary: 'Listar barbeiros',
				tags: ['User'],
				parameters: [
					{
						name: 'barberShopId',
						in: 'path',
						required: true,
						schema: { type: 'string', format: 'uuid' },
						description: 'ID da barbearia',
					},
				],
				responses: {
					200: {
						description: 'Lista de barbeiros',
						content: {
							'application/json': {
								schema: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: { type: 'string', format: 'uuid' },
											userId: { type: 'string', format: 'uuid' },
											specialty: { type: 'string' },
											barberShopId: { type: 'string', format: 'uuid' },
											user: {
												id: { type: 'string', format: 'uuid' },
												name: { type: 'string' },
												email: { type: 'string' },
												role: { type: 'string' },
												isActive: { type: 'boolean' },
												createdAt: { type: 'string', format: 'date-time' },
												updatedAt: { type: 'string', format: 'date-time' },
												barberShopId: { type: 'string', format: 'uuid' },
											},
										},
										example: {
											id: 'barber_id_here',
											userId: 'user_id_here',
											specialty: 'Haircut',
											barberShopId: 'barber_shop_id_here',
											user: {
												id: 'user_id_here',
												name: 'John Doe',
												email: 'john.doe@example.com',
												role: 'BARBER',
												isActive: true,
												createdAt: '2026-02-10T22:01:01.210Z',
												updatedAt: '2026-02-10T22:01:01.210Z',
												barberShopId: 'barber_shop_id_here',
											},
										},
									},
								},
							},
						},
					},
					400: {
						description: 'ID da barbearia inválido',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message: 'Barbershop ID is invalid',
									},
								},
							},
						},
					},
					404: {
						description: 'Barbearia não encontrada',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message: 'BarberShop not found',
									},
								},
							},
						},
					},
				},
			},
			post: {
				summary: 'Registrar Barbeiro',
				tags: ['User'],
				parameters: [
					{
						name: 'barberShopId',
						in: 'path',
						required: true,
						schema: { type: 'string', format: 'uuid' },
						description: 'ID da barbearia',
					},
				],
				requestBody: {
					content: {
						'application/json': {
							schema: createBarberBody,
						},
					},
				},
				responses: {
					201: {
						description: 'Barbeiro registrado com sucesso',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message: 'Barber registered successfully',
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
		'/users/{barberShopId}/barbers/{id}': {
			delete: {
				summary: 'Deletar Barbeiro',
				tags: ['User'],
				parameters: [
					{
						name: 'barberShopId',
						in: 'path',
						required: true,
						schema: { type: 'string', format: 'uuid' },
						description: 'ID da barbearia',
					},
					{
						name: 'id',
						in: 'path',
						required: true,
						schema: { type: 'string', format: 'uuid' },
						description: 'ID do barbeiro',
					},
				],
				responses: {
					204: {
						description: 'Barbeiro deletado com sucesso',
					},
					400: {
						description: 'ID do barbeiro inválido',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message: 'Barber ID is invalid',
									},
								},
							},
						},
					},
					404: {
						description: 'Barbeiro não encontrado',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message: 'Barber not found',
									},
								},
							},
						},
					},
					403: {
						description: 'Usuário sem permissão para realizar esta ação',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										message: { type: 'string' },
									},
									example: {
										message:
											'User does not have permission to perform this action',
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
});
