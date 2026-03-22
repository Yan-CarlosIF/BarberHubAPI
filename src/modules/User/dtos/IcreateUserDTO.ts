import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve conter pelo menos 6 caracteres'),
    barberShopId: z.string().nullable(),
    isActive: z.boolean().optional().default(true),
  })
  .meta({ description: 'Body para criação de usuário' });

export interface ICreateUserDTO extends z.infer<typeof createUserSchema> {}
