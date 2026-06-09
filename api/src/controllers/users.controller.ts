import { prisma } from "../models/index.ts";
import type { Request, Response } from "express";
import z from "zod";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../lib/errors.ts";

const updateUserSchema = z.object({
    username: z.string().min(2).max(100).optional(),
    email: z.email().optional(),
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