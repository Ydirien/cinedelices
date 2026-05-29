import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtSecret: process.env.JWT_SECRET ?? "change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "change-me",
  logLevel: process.env.LOG_LEVEL ?? "info",
  logServiceHost: process.env.LOG_SERVICE_HOST ?? "localhost",
  logServicePort: Number(process.env.LOG_SERVICE_PORT) || 3100,
} as const;

export type Config = typeof config;