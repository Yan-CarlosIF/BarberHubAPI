import { PrismaClient } from '@prisma/client';
import adapter from './connection';

export const prisma = new PrismaClient({
  adapter,
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
});
