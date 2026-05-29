import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV ?? "development",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "change-me",
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) ?? [],
  logLevel: process.env.LOG_LEVEL ?? "info",
  logServiceHost: process.env.LOG_SERVICE_HOST ?? "localhost",
  logServicePort: Number(process.env.LOG_SERVICE_PORT) || 3100,
} as const;

export type Config = typeof config;