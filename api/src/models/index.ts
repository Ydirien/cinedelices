import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from "../../prisma/generated/client.ts";
import { config } from '../../config.ts';

export * from '../../generated/client.ts';

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });