import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
} as const;

export type Config = typeof config;