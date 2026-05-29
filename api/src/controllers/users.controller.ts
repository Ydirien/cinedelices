import { prisma } from "../models/index.ts";
import type { Request, Response } from "express";
import z from "zod";
import { BadRequestError, ConflictError, UnauthorizedError } from "../lib/errors.ts";

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