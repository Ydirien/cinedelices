import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV ?? "development",
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET ?? "change-me",
  resetTokenSecret: process.env.RESET_TOKEN_SECRET ?? "change-me",
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) ?? [],
  logLevel: process.env.LOG_LEVEL ?? "info",
  logServiceHost: process.env.LOG_SERVICE_HOST ?? "localhost",
  logServicePort: Number(process.env.LOG_SERVICE_PORT) || 3100,
  mailtrap: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
  frontEndUrl: process.env.FRONTEND_URL
} as const;

export type Config = typeof config;