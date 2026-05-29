import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { NotFoundError } from '../lib/errors.ts';

export async function getAllThematics(req: Request, res: Response) {
    const thematics = await prisma.thematic.findMany();
    if (thematics.length === 0) {
        throw new NotFoundError("No thematics found");
    }
    res.json(thematics);
}

export async function getThematicById(req: Request, res: Response) {
    const { id } = req.params;
    const thematic = await prisma.thematic.findUnique({
        where: { id: Number(id) },
    });
    if (!thematic) {
        throw new NotFoundError("Thematic not found");
    }
    res.json(thematic);
}