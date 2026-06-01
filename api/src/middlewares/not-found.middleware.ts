import type { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../lib/errors.ts";

export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
    next(new NotFoundError("Resource not found"));
}