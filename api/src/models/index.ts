import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/client.js';

export * from "../../prisma/generated/client.ts";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });