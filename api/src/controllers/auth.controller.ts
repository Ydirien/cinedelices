import argon2 from "argon2";
import z from "zod";
import type { Request, Response } from "express";
import type { User } from "../models/index.ts"
import { prisma } from "../models/index.ts";
import { ConflictError, UnauthorizedError } from "../lib/errors.ts";
import { generateAuthTokens, type Token } from "../lib/tokens.ts";

export async function registerUser(req: Request, res: Response) {
    const registerUserBodySchema = z
        .object({
        username: z.string().min(2).max(30),
        email: z.email(),
        password: z
            .string()
            .min(12)
            .max(30)
            .regex(/[a-z]/, "Password must contain at least one lowercase caracter")
            .regex(/[A-Z]/, "Password must contain at least one uppercase caracter")
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirm: z.string(),
        })

        .refine(data => data.password === data.confirm, {
        message: "Passwords don't match",
        path: ["confirm"],
        });

    const { username, email, password } =
        await registerUserBodySchema.parseAsync(req.body);

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
        throw new ConflictError("Email already used");
    }

    const passwordHash = await argon2.hash(password);

    const user = await prisma.user.create({
        data: {
        username,
        email,
        password: passwordHash,
        },
    });

    res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
    });
}

export async function loginUser(req: Request, res: Response) {
    const loginUserBodySchema = z.object({
        email: z.email(),
        password: z.string(),
    });

    const { email, password } = await loginUserBodySchema.parseAsync(req.body);

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
        throw new UnauthorizedError("Email and password do not match");
    }

    const isMatching = await argon2.verify(user.password, password);

    if (!isMatching) {
        throw new UnauthorizedError("Email and password do not match");
    }

    const { accessToken, refreshToken } = generateAuthTokens(user);


    await replaceRefreshTokenInDatabase(refreshToken, user);

    res.json({ accessToken, refreshToken });
}

export async function logoutUser(req: Request, res: Response) {
    await prisma.refreshToken.deleteMany({ where: { userId: req.user.id } });
    res.status(204).end();
}

export async function refreshTokens(req: Request, res: Response) {
    const token = req.body?.refreshToken;

    if (!token) throw new UnauthorizedError("Refresh token not provided");

    const existingToken = await prisma.refreshToken.findFirst({
        where: { token },
        include: { user: true },
    });
    if (!existingToken) throw new UnauthorizedError("Invalid Refresh token");

    if (existingToken.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { id: existingToken.id } });
        throw new UnauthorizedError("Invalid Refresh token");
    }
    const { accessToken, refreshToken } = generateAuthTokens(existingToken.user);
    await replaceRefreshTokenInDatabase(refreshToken, existingToken.user);
    res.json({ accessToken, refreshToken });
}

async function replaceRefreshTokenInDatabase(refreshToken: Token, user: User) {

    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

    await prisma.refreshToken.create({
        data: {
        token: refreshToken.token,
        userId: user.id,
        issuedAt: new Date(),
        expiresAt: new Date(new Date().valueOf() + refreshToken.expiresInMS),
        },
    });
}

export async function forgetPassword (req:Request,res:Response) {
    
}