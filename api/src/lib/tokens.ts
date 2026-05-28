import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import type { Response } from "express";
import type { User } from "../models/index.ts";
import { config } from "../../config.ts";

export interface Token {
    token: string;
    type: string;
    expiresInMS: number;
}

export function generateAuthTokens(user: User) {
    const payload = {
        id: user.id,
        role: user.role,
    };

    const accessToken = jwt.sign(payload, config.jwtSecret, {
        expiresIn: "15m",
    });

    const refreshToken = randomBytes(64).toString("hex");

    return {
        accessToken: {
        token: accessToken,
        type: "Bearer",
        expiresInMS: 15 * 60 * 1000,
        },
        refreshToken: {
        token: refreshToken,
        type: "Bearer",
        expiresInMS: 7 * 24 * 60 * 60 * 1000,
        },
    };
}

const isProduction = process.env.NODE_ENV === "production";

export function setAccessTokenCookie(res: Response, accessToken: Token) {
    res.cookie("accessToken", accessToken.token, {
        httpOnly: true,
        maxAge: accessToken.expiresInMS,
        sameSite: "none",
        secure: isProduction,
    });
}

export function setRefreshTokenCookie(res: Response, refreshToken: Token) {
    res.cookie("refreshToken", refreshToken.token, {
        httpOnly: true,
        maxAge: refreshToken.expiresInMS,
        sameSite: "none",
        secure: isProduction,
        path: "/api/auth/refresh",
    });
}