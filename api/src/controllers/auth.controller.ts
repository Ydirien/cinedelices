import argon2 from "argon2";
import z from "zod";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { User } from "../models/index.ts"
import { prisma } from "../models/index.ts";
import { ConflictError, UnauthorizedError } from "../lib/errors.ts";
import { generateAuthTokens, generateResetPasswordToken, type Token } from "../lib/tokens.ts";
import { sendResetPasswordEmail } from "../lib/mailer.ts";
import { config } from "../../config.ts";

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

export async function forgetPassword(req: Request, res: Response) {
    const { email } = z.object({ email: z.email() }).parse(req.body);

    // On cherche l'utilisateur par email
    const user = await prisma.user.findFirst({ where: { email } });

    // Que l'email existe ou non, on retourne toujours le même message (sécurité : évite l'énumération d'emails)
    if (!user) {
        return res.status(200).json("If the email address is associated with an account, you will receive an email");
    }

    // Génération d'un JWT reset token (expire dans 15min)
    const resetToken = generateResetPasswordToken(user);

    // On hash le token avant de le stocker en base (sécurité : si la base est compromise, les tokens sont inutilisables)
    const hashedResetToken = await argon2.hash(resetToken);

    // Sauvegarde du token hashé en base
    await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: hashedResetToken }
    });

    // Envoi de l'email avec le token non hashé (le destinataire a besoin du token original)
    await sendResetPasswordEmail(email, resetToken);

    // Même message que si l'utilisateur n'existe pas (sécurité)
    return res.status(200).json("If the email address is associated with an account, you will receive an email");
}

export async function resetPassword(req: Request, res: Response) {
    const resetPasswordBodySchema = z.object({
        email: z.email(),
        resetToken: z.string(),
        newPassword: z
            .string()
            .min(12)
            .max(30)
            .regex(/[a-z]/, "Password must contain at least one lowercase character")
            .regex(/[A-Z]/, "Password must contain at least one uppercase character")
            .regex(/[0-9]/, "Password must contain at least one number"),
    });

    const { email, resetToken, newPassword } = await resetPasswordBodySchema.parseAsync(req.body);

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user || !user.resetToken) {
        throw new UnauthorizedError("Invalid or expired reset token");
    }

    try {
        jwt.verify(resetToken, config.resetTokenSecret);
    } catch {
        throw new UnauthorizedError("Invalid or expired reset token");
    }

    const isMatching = await argon2.verify(user.resetToken, resetToken);

    if (!isMatching) {
        throw new UnauthorizedError("Invalid or expired reset token");
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await argon2.hash(newPassword);

    // Mise à jour du mot de passe et suppression du reset token
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null, // On supprime le token pour qu'il ne puisse pas être réutilisé
        }
    });

    return res.status(200).json("Password reset successfully");
}