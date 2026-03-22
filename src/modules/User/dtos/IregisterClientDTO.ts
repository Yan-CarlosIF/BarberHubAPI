import { z } from 'zod';

export const registerClientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.email('Email inválido'),
  password: z.string().min(6, 'Senha deve conter pelo menos 6 caracteres'),
  barberShopId: z.uuid().nonempty('ID da barbearia é obrigatório'),
  isActive: z.boolean().optional().default(true),
  phone: z
    .string()
    .regex(
      /^\(\d{2}\) \d{4,5}-\d{4}$/,
      'Telefone deve estar no formato (XX) XXXXX-XXXX',
    ),
  birthDate: z.coerce.date(),
});

export const registerClientBody = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.email('Email inválido'),
    password: z.string().min(6, 'Senha deve conter pelo menos 6 caracteres'),
    phone: z
      .string()
      .regex(
        /^\(\d{2}\) \d{4,5}-\d{4}$/,
        'Telefone deve estar no formato (XX) XXXXX-XXXX',
      ),
    birthDate: z.coerce.date(),
  })
  .meta({ description: 'Body para registrar um cliente' });

export interface IRegisterClientDTO
  extends z.infer<typeof registerClientSchema> {}
