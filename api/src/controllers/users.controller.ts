import argon2 from "argon2";
import { prisma } from "../models/index.ts";
import type { Request, Response } from "express";
import z from "zod";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../lib/errors.ts";

const updateUserSchema = z.object({
    username: z.string().min(2).max(100).optional(),
    email: z.email().optional(),
});

const changePasswordSchema = z
    .object({
        currentPassword: z.string(),
        newPassword: z
            .string()
            .min(12)
            .max(30)
            .regex(/[a-z]/, "Password must contain at least one lowercase character")
            .regex(/[A-Z]/, "Password must contain at least one uppercase character")
            .regex(/[0-9]/, "Password must contain at least one number"),
        confirm: z.string(),
    })
    .refine((data) => data.newPassword === data.confirm, {
        message: "Passwords don't match",
        path: ["confirm"],
    });

export async function getUserProfile(req: Request, res: Response) {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        omit: { password: true },
    });

    if (!user) throw new UnauthorizedError("User not found");

    res.json(user);
}

export async function updateUserProfile(req: Request, res: Response) {
    const data = await updateUserSchema.parseAsync(req.body);

    if (Object.keys(data).length === 0) {
        throw new BadRequestError("No data provided for update");
    }

    if (data.email) {
        const emailTaken = await prisma.user.findFirst({
            where: { email: data.email, NOT: { id: req.user.id } },
        });

        if (emailTaken) throw new ConflictError("Email already used");
    }

    const updatedUser = await prisma.user.update({
        where: { id: req.user.id },
        data,
        omit: { password: true },
    });

    res.json(updatedUser);
}

export async function deleteAccount(req: Request, res: Response) {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw new NotFoundError("User not found");

    await prisma.$transaction(async (tx) => {
        // La relation Recipe->User n'a pas de onDelete Cascade, on supprime d'abord les recettes
        await tx.recipe.deleteMany({ where: { userId: req.user.id } });
        await tx.user.delete({ where: { id: req.user.id } });
    });

    res.status(204).send();
}

export async function changePassword(req: Request, res: Response) {
    const { currentPassword, newPassword } = await changePasswordSchema.parseAsync(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) throw new UnauthorizedError("User not found");

    const isMatching = await argon2.verify(user.password, currentPassword);
    if (!isMatching) throw new UnauthorizedError("Current password is incorrect");

    const hashedPassword = await argon2.hash(newPassword);
    await prisma.user.update({
        where: { id: req.user.id },
        data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password updated successfully" });
}

export async function getOwnRecipes(req: Request, res: Response) {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const stateFilter = req.query.state
        ? z.enum(["PENDING", "APPROVED", "REJECTED"]).parse(req.query.state)
        : undefined;

    const where = {
        userId: req.user.id,
        ...(stateFilter && { state: stateFilter }),
    };

    const [recipes, total] = await Promise.all([
        prisma.recipe.findMany({
            where,
            include: {
                work: { select: { id: true, title: true, image: true } },
                thematics: { include: { thematic: { select: { id: true, name: true } } } },
                _count: { select: { likes: true, comments: true } },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.recipe.count({ where }),
    ]);

    res.json({
        data: recipes,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
}

export async function getLikedRecipes(req: Request, res: Response) {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
        prisma.like.findMany({
            where: { userId: req.user.id },
            include: {
                recipe: {
                    include: {
                        work: { select: { id: true, title: true, image: true } },
                        user: { select: { id: true, username: true } },
                        thematics: { include: { thematic: { select: { id: true, name: true } } } },
                        _count: { select: { likes: true, comments: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.like.count({ where: { userId: req.user.id } }),
    ]);

    res.json({
        data: likes.map((l) => l.recipe),
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
}