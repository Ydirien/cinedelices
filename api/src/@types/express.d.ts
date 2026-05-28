import type { logger } from "../lib/logger.ts";
import type { Role } from "../models/index.ts";

declare global {
    namespace Express {
        interface Request {
        user: {
            id: number;
            role: Role;
        };
        requestId?: string;
        log: typeof logger;
        }
    }
}

export {};