import 'dotenv/config';
import { env } from '@config/env';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = env.DATABASE_URL;

export default new PrismaPg(new Pool({ connectionString }));
