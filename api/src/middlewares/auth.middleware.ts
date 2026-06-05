import { Role } from "../models/index.ts";
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../../config.ts";
import { UnauthorizedError, ForbiddenError } from "../lib/errors.ts";

interface AppJwtPayload extends JwtPayload {
    id: number;
    role: Role;
}

export function checkRoles(roles: Role[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = extractAccessToken(req);
        const { id, role } = verifyAndDecodeJWT(token);

        if (!roles.includes(role))
            throw new ForbiddenError(`Permission denied for role ${role}`);

        req.user = { id, role };
        next();
    };
}

// Middleware optionnel : hydrate req.user si un token valide est présent, ne bloque pas sinon
export function softAuth(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers?.authorization;
    if (typeof authHeader !== "string") return next();

    const token = authHeader.split(" ")[1];
    if (!token) return next();

    try {
        const { id, role } = verifyAndDecodeJWT(token);
        req.user = { id, role };
    } catch {
        // token invalide ou expiré → on ignore, la route reste accessible
    }

    next();
}

function extractAccessToken(req: Request): string {
    if (typeof req.headers?.authorization === "string") {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) throw new UnauthorizedError("Access token not provided");
        return token;
    }

    throw new UnauthorizedError("Access token not provided");
}

function verifyAndDecodeJWT(accessToken: string): AppJwtPayload {
    try {
        const payload = jwt.verify(accessToken, config.accessTokenSecret) as AppJwtPayload;

        if (typeof payload.id !== "number" || !payload.role) {
            throw new UnauthorizedError("Invalid token payload");
        }

        return payload;
    } catch (error) {
        if (error instanceof UnauthorizedError) throw error;
        throw new UnauthorizedError("Invalid or expired access token");
    }
}