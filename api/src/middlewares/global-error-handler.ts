import type { NextFunction, Request, Response } from "express";
import { HttpClientError } from "../lib/errors.ts";
import z from "zod";
import { logger } from "../lib/logger.ts";

export function globalErrorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
    ) {

    if (error instanceof z.ZodError) {
        console.info("ZodError", error);

        return res.status(400).json({
        status: 400,
        error: z.prettifyError(error),
        });
    }

    if (error instanceof HttpClientError) {
        logger.info("HttpClientError", error);

        return res.status(error.status).json({
        status: error.status,
        error: error.message,
        });
    }

    logger.error("Internal server error", error);
    res.status(500).json({
        status: 500,
        error: "Internal server error",
    });
}