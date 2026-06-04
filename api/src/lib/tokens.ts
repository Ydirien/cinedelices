import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
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

    const accessToken = jwt.sign(payload, config.accessTokenSecret, {
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

export function generateResetPasswordToken(user: User) {
    const payload = {
        id: user.id,
    };

    const resetToken = jwt.sign(payload, config.resetTokenSecret, {
        expiresIn: "15m",
    });

    return resetToken;
}