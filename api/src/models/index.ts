import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/client.js';

export * from "../../prisma/generated/client.ts";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL environment variable is not defined");
const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });