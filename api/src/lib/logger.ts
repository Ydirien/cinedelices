import { createLogger, format, transports } from "winston";
import { config } from "../../config.ts";
import process from "node:process";

export const logger = createLogger({
    level: config.logLevel,
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
        format.printf(({ timestamp, level, message, ...meta }) => {
        return JSON.stringify({
            timestamp,
            level,
            message,
            service: "oquiz-api",
            pid: process.pid,
            ...meta,
        });
        }),
    ),
    transports: [
        new transports.File({
        filename: "errors.log",
        level: "error",
        maxsize: 5242880,
        maxFiles: 10,
        }),
        new transports.File({
        filename: "combined.log",
        maxsize: 5242880,
        maxFiles: 10,
        }),
        new transports.Http({
        level: "http",
        host: config.logServiceHost,
        port: config.logServicePort,
        path: "/api/logs",
        }),
    ],
    exceptionHandlers: [
        new transports.File({
        filename: "exceptions.log",
        }),
    ],
    rejectionHandlers: [
        new transports.File({
        filename: "rejections.log",
        }),
    ],
    });

    if (process.env.NODE_ENV !== "production") {
    logger.add(
        new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple(),
            format.printf(({ timestamp, level, message, stack, ...meta }) => {
            const metaString = Object.keys(meta).length
                ? JSON.stringify(meta, null, 2)
                : "";
            const stackString = stack ? `\n${stack}` : "";
            return `${timestamp} [${level}]: ${message}${stackString}${metaString ? `\n${metaString}` : ""}`;
            }),
        ),
        }),
    );
}