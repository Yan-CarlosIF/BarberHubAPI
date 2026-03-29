import { assignBarberServiceBodySchema } from '@modules/Barber/dtos/IAssignBarberServiceDTO';
import { createBarberAvailabilityBodySchema } from '@modules/Barber/dtos/ICreateBarberAvailabilityDTO';
import { createBarberBlockBodySchema } from '@modules/Barber/dtos/ICreateBarberBlockDTO';
import { createBarberBody } from '@modules/Barber/dtos/ICreateBarberDTO';
import { updateBarberSchema } from '@modules/Barber/dtos/IUpdateBarberDTO';
import { createBarberShopDTO } from '@modules/BarberShop/dtos/IcreateBarberShopDTO';
import { createScheduleBodySchema } from '@modules/Schedule/dtos/ICreateScheduleDTO';
import { updateScheduleStatusBodySchema } from '@modules/Schedule/dtos/IUpdateScheduleStatusDTO';
import { createServiceBodySchema } from '@modules/Service/dtos/ICreateServiceDTO';
import { updateServiceSchema } from '@modules/Service/dtos/IUpdateServiceDTO';
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
    '/auth/{barberShopIdOrSlug}/register': {
      post: {
        summary: 'Registrar Cliente',
        tags: ['User'],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou Slug da barbearia',
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
    '/users/{barberShopIdOrSlug}/admin': {
      post: {
        summary: 'Registrar Administrador',
        tags: ['User'],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou Slug da barbearia',
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
      get: {
        summary: 'Listar Administradores',
        tags: ['User'],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou Slug da barbearia',
          },
        ],
        responses: {
          200: {
            description: 'Lista de administradores',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      barberShopId: { type: 'string', format: 'uuid' },
                      name: { type: 'string' },
                      email: { type: 'string', format: 'email' },
                      role: { type: 'string', example: 'ADMIN' },
                      isActive: { type: 'boolean' },
                    },
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
                    message: {
                      type: 'string',
                      example: 'Barber shop not found',
                    },
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
                    message: {
                      type: 'string',
                      example:
                        'User does not have permission to perform this action',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/barbers/{barberShopIdOrSlug}': {
      get: {
        summary: 'Listar barbeiros',
        tags: ['Barber'],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
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
        tags: ['Barber'],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
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
    '/barbers/{barberShopIdOrSlug}/pagination': {
      get: {
        summary: 'Listar barbeiros com paginação',
        tags: ['Barber'],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
          {
            name: 'offset',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 0 },
            description: 'Número de itens a pular para paginação',
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer' },
            description: 'Número máximo de itens a retornar',
          },
        ],
        responses: {
          200: {
            description: 'Lista de barbeiros com paginação',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    barbers: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'string', format: 'uuid' },
                          specialty: { type: 'string?' },
                        },
                      },
                    },
                    total: { type: 'integer' },
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    lastPage: { type: 'integer' },
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
                    message: {
                      type: 'string',
                      example: 'Barber shop not found',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/barbers/{barberShopIdOrSlug}/{id}': {
      delete: {
        summary: 'Deletar Barbeiro',
        tags: ['Barber'],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
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
      patch: {
        summary: 'Atualizar Barbeiro',
        tags: ['Barber'],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do barbeiro',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: updateBarberSchema.omit({ id: true }),
            },
          },
        },
        responses: {
          200: {
            description: 'Barbeiro atualizado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Barber updated successfully',
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
          409: {
            description: 'Email já registrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Email already taken',
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
            description: 'Slug, email ou telefone da barbearia já registrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Barber shop slug, email or phone already taken',
                  },
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Listar Barbearias',
        tags: ['BarberShop'],
        responses: {
          200: {
            description: 'Lista de barbearias',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      name: { type: 'string' },
                      slug: { type: 'string' },
                      email: { type: 'string' },
                      phone: { type: 'string' },
                      city: { type: 'string' },
                      street: { type: 'string' },
                      state: { type: 'string' },
                      cep: { type: 'string' },
                      description: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time' },
                    },
                    example: {
                      id: 'barber_shop_id_here',
                      name: 'Barber Shop Name',
                      slug: 'barber-shop-slug',
                      email: 'barbershop@example.com',
                      phone: '1234567890',
                      city: 'City Name',
                      street: 'Street Name',
                      state: 'State Name',
                      cep: '12345-678',
                      description: 'Description of the barber shop',
                      createdAt: '2023-01-01T00:00:00Z',
                    },
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
    '/barber-shop/{idOrSlug}': {
      delete: {
        summary: 'Deletar Barbearia',
        tags: ['BarberShop'],
        parameters: [
          {
            name: 'idOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
        ],
        responses: {
          204: {
            description: 'Barbearia deletada com sucesso',
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
                    message: 'Barber shop ID is invalid',
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
                    message: 'Barber shop not found',
                  },
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Obter Barbearia por ID ou Slug',
        tags: ['BarberShop'],
        parameters: [
          {
            name: 'idOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
        ],
        responses: {
          200: {
            description: 'Barbearia encontrada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', format: 'uuid' },
                    name: { type: 'string' },
                    slug: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    phone: { type: 'string' },
                    city: { type: 'string' },
                    street: { type: 'string' },
                    state: { type: 'string' },
                    cep: { type: 'string' },
                    description: { type: 'string' },
                    createdAt: { type: 'string', format: 'date-time' },
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
                    message: 'Barber shop not found',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/services/{barberShopIdOrSlug}': {
      post: {
        summary: 'Criar Serviço',
        tags: ['Service'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: createServiceBodySchema,
            },
          },
        },
        responses: {
          201: {
            description: 'Serviço criado com sucesso',
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
                    message: 'Barber shop not found',
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
      get: {
        summary: 'Listar Serviços por Barbearia',
        tags: ['Service'],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
        ],
        responses: {
          200: {
            description: 'Lista de serviços da barbearia',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      barberShopId: { type: 'string', format: 'uuid' },
                      name: { type: 'string' },
                      description: { type: 'string', nullable: true },
                      price: { type: 'number' },
                      durationInMinutes: { type: 'integer' },
                      isActive: { type: 'boolean' },
                      createdAt: { type: 'string', format: 'date-time' },
                    },
                    example: {
                      id: 'service_id_here',
                      barberShopId: 'barber_shop_id_here',
                      name: 'Corte de cabelo',
                      description: 'Corte masculino',
                      price: 50,
                      durationInMinutes: 30,
                      isActive: true,
                      createdAt: '2026-02-21T00:00:00Z',
                    },
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
                    message: 'Barber shop not found',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/services/{barberShopIdOrSlug}/{id}': {
      patch: {
        summary: 'Atualizar Serviço',
        tags: ['Service'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do serviço',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: updateServiceSchema,
            },
          },
        },
        responses: {
          204: {
            description: 'Serviço atualizado com sucesso',
          },
          404: {
            description: 'Serviço não encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Service not found',
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
      delete: {
        summary: 'Deletar Serviço',
        tags: ['Service'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do serviço',
          },
        ],
        responses: {
          204: {
            description: 'Serviço deletado com sucesso',
          },
          404: {
            description: 'Serviço não encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Service not found',
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
    '/schedules/{barberShopIdOrSlug}': {
      post: {
        summary: 'Criar Agendamento',
        tags: ['Schedule'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: createScheduleBodySchema,
            },
          },
        },
        responses: {
          201: {
            description: 'Agendamento criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Schedule created successfully',
                  },
                },
              },
            },
          },
          401: {
            description: 'Usuário não autenticado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'User not authenticated',
                  },
                },
              },
            },
          },
          404: {
            description: 'Serviço não encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Service not found',
                  },
                },
              },
            },
          },
          409: {
            description: 'Conflito de horário',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'This time slot is already booked for this barber',
                  },
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Listar Agendamentos por Barbearia',
        tags: ['Schedule'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
        ],
        responses: {
          200: {
            description: 'Lista de agendamentos da barbearia',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      barberShopId: { type: 'string', format: 'uuid' },
                      clientId: { type: 'string', format: 'uuid' },
                      barberId: { type: 'string', format: 'uuid' },
                      serviceId: { type: 'string', format: 'uuid' },
                      date: { type: 'string', format: 'date' },
                      startTime: { type: 'string', example: '10:00' },
                      endTime: { type: 'string', example: '10:30' },
                      status: {
                        type: 'string',
                        enum: ['SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW'],
                      },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' },
                    },
                    example: {
                      id: 'schedule_id_here',
                      barberShopId: 'barber_shop_id_here',
                      clientId: 'client_id_here',
                      barberId: 'barber_id_here',
                      serviceId: 'service_id_here',
                      date: '2026-03-15',
                      startTime: '10:00',
                      endTime: '10:30',
                      status: 'SCHEDULED',
                      createdAt: '2026-03-14T12:00:00Z',
                      updatedAt: '2026-03-14T12:00:00Z',
                    },
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
    '/schedules/my-schedules': {
      get: {
        summary: 'Listar Agendamentos do Cliente Autenticado',
        tags: ['Schedule'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Lista de agendamentos do cliente',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      barberShopId: { type: 'string', format: 'uuid' },
                      clientId: { type: 'string', format: 'uuid' },
                      barberId: { type: 'string', format: 'uuid' },
                      serviceId: { type: 'string', format: 'uuid' },
                      date: { type: 'string', format: 'date' },
                      startTime: { type: 'string', example: '10:00' },
                      endTime: { type: 'string', example: '10:30' },
                      status: {
                        type: 'string',
                        enum: ['SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW'],
                      },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Usuário não autenticado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'User not authenticated',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/schedules/{barberShopIdOrSlug}/barber/{barberId}': {
      get: {
        summary: 'Listar Agendamentos por Barbeiro',
        tags: ['Schedule'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
          {
            name: 'barberId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do barbeiro',
          },
        ],
        responses: {
          200: {
            description: 'Lista de agendamentos do barbeiro',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      barberShopId: { type: 'string', format: 'uuid' },
                      clientId: { type: 'string', format: 'uuid' },
                      barberId: { type: 'string', format: 'uuid' },
                      serviceId: { type: 'string', format: 'uuid' },
                      date: { type: 'string', format: 'date' },
                      startTime: { type: 'string', example: '10:00' },
                      endTime: { type: 'string', example: '10:30' },
                      status: {
                        type: 'string',
                        enum: ['SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW'],
                      },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Usuário não autenticado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Usuário não autorizado',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/schedules/{barberShopIdOrSlug}/{id}/cancel': {
      patch: {
        summary: 'Cancelar Agendamento',
        tags: ['Schedule'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do agendamento',
          },
        ],
        responses: {
          204: {
            description: 'Agendamento cancelado com sucesso',
          },
          400: {
            description: 'Agendamento já cancelado ou não pode ser cancelado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Schedule is already canceled',
                  },
                },
              },
            },
          },
          404: {
            description: 'Agendamento não encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Schedule not found',
                  },
                },
              },
            },
          },
        },
      },
    },
    '/schedules/{barberShopIdOrSlug}/{id}/status': {
      patch: {
        summary: 'Atualizar Status do Agendamento',
        tags: ['Schedule'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberShopIdOrSlug',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID ou slug da barbearia',
          },
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do agendamento',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: updateScheduleStatusBodySchema,
            },
          },
        },
        responses: {
          204: {
            description: 'Status do agendamento atualizado com sucesso',
          },
          400: {
            description:
              'Não é possível atualizar um agendamento cancelado ou concluído',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Cannot update a canceled schedule',
                  },
                },
              },
            },
          },
          404: {
            description: 'Agendamento não encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' },
                  },
                  example: {
                    message: 'Schedule not found',
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

    // ── Barber Availability ────────────────────────────────────

    '/barbers/{barberId}/availability': {
      post: {
        summary: 'Definir Disponibilidade do Barbeiro',
        description:
          'Define (cria ou substitui) o horário de trabalho do barbeiro para um dia da semana. Requer autenticação e permissão de administrador.',
        tags: ['Barber'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do barbeiro',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: createBarberAvailabilityBodySchema,
            },
          },
        },
        responses: {
          201: {
            description: 'Disponibilidade definida com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: { message: 'Availability set successfully' },
                },
              },
            },
          },
          400: {
            description: 'Horário inválido',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: {
                    message: 'Start time must be before end time',
                  },
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Listar Disponibilidade do Barbeiro',
        description:
          'Lista todos os horários de trabalho configurados para o barbeiro, separados por dia da semana.',
        tags: ['Barber'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do barbeiro',
          },
        ],
        responses: {
          200: {
            description: 'Lista de disponibilidades',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      barberId: { type: 'string', format: 'uuid' },
                      weekDay: {
                        type: 'string',
                        enum: [
                          'SUNDAY',
                          'MONDAY',
                          'TUESDAY',
                          'WEDNESDAY',
                          'THURSDAY',
                          'FRIDAY',
                          'SATURDAY',
                        ],
                      },
                      startTime: { type: 'string', example: '09:00' },
                      endTime: { type: 'string', example: '18:00' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Deletar Toda Disponibilidade do Barbeiro',
        description:
          'Remove todos os horários de trabalho configurados para o barbeiro. Requer autenticação e permissão de administrador.',
        tags: ['Barber'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do barbeiro',
          },
        ],
        responses: {
          204: {
            description: 'Disponibilidade removida com sucesso',
          },
          404: {
            description: 'Nenhuma disponibilidade encontrada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: {
                    message: 'No availability found for this barber',
                  },
                },
              },
            },
          },
        },
      },
    },

    // ── Barber Blocks ─────────────────────────────────────────

    '/barbers/{barberId}/blocks': {
      post: {
        summary: 'Criar Bloqueio de Horário',
        description:
          'Cria um bloqueio de horário para o barbeiro em uma data específica. Requer autenticação e permissão de administrador.',
        tags: ['Barber'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do barbeiro',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: createBarberBlockBodySchema,
            },
          },
        },
        responses: {
          201: {
            description: 'Bloqueio criado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: { message: 'Block created successfully' },
                },
              },
            },
          },
          400: {
            description: 'Horário inválido',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: {
                    message: 'Start time must be before end time',
                  },
                },
              },
            },
          },
          409: {
            description: 'Conflito com bloqueio existente',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: {
                    message:
                      'There is already a block overlapping this time range',
                  },
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Listar Bloqueios do Barbeiro',
        description: 'Lista todos os bloqueios de horário do barbeiro.',
        tags: ['Barber'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do barbeiro',
          },
        ],
        responses: {
          200: {
            description: 'Lista de bloqueios',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      barberId: { type: 'string', format: 'uuid' },
                      date: {
                        type: 'string',
                        format: 'date',
                        example: '2026-03-15',
                      },
                      startTime: { type: 'string', example: '12:00' },
                      endTime: { type: 'string', example: '14:00' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/barbers/{barberId}/blocks/{blockId}': {
      delete: {
        summary: 'Deletar Bloqueio de Horário',
        description:
          'Remove um bloqueio de horário específico. Requer autenticação e permissão de administrador.',
        tags: ['Barber'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do barbeiro',
          },
          {
            name: 'blockId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do bloqueio',
          },
        ],
        responses: {
          204: {
            description: 'Bloqueio removido com sucesso',
          },
          404: {
            description: 'Bloqueio não encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: { message: 'Block not found' },
                },
              },
            },
          },
        },
      },
    },

    // ── Barber Services ───────────────────────────────────────

    '/barbers/{barberId}/services': {
      post: {
        summary: 'Associar Serviço ao Barbeiro',
        description:
          'Associa um serviço já existente a um barbeiro específico, indicando que ele é apto a realizá-lo. Requer autenticação e permissão de administrador.',
        tags: ['Barber'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do barbeiro',
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: assignBarberServiceBodySchema,
            },
          },
        },
        responses: {
          201: {
            description: 'Serviço associado com sucesso',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: { message: 'Service assigned successfully' },
                },
              },
            },
          },
          404: {
            description: 'Serviço não encontrado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: { message: 'Service not found' },
                },
              },
            },
          },
          409: {
            description: 'Serviço já associado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: {
                    message: 'This service is already assigned to this barber',
                  },
                },
              },
            },
          },
        },
      },
      get: {
        summary: 'Listar Serviços do Barbeiro',
        description:
          'Lista todos os serviços que estão associados ao barbeiro.',
        tags: ['Barber'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do barbeiro',
          },
        ],
        responses: {
          200: {
            description: 'Lista de serviços associados',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', format: 'uuid' },
                      barberId: { type: 'string', format: 'uuid' },
                      serviceId: { type: 'string', format: 'uuid' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/barbers/{barberId}/services/{serviceId}': {
      delete: {
        summary: 'Desassociar Serviço do Barbeiro',
        description:
          'Remove a associação de um serviço de um barbeiro. Requer autenticação e permissão de administrador.',
        tags: ['Barber'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'barberId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do barbeiro',
          },
          {
            name: 'serviceId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID do serviço',
          },
        ],
        responses: {
          204: {
            description: 'Serviço desassociado com sucesso',
          },
          404: {
            description: 'Associação não encontrada',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string' } },
                  example: {
                    message: 'This service is not assigned to this barber',
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
