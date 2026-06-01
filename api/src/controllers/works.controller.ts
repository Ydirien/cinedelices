import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { NotFoundError } from '../lib/errors.ts';

export async function getAllWorks(req: Request, res: Response) {
    const { category } = req.query;

    const works = await prisma.work.findMany({
        where: {
            ...(category && { category: { name: { equals: String(category), mode: 'insensitive' } } }),
        },
        include: { category: true, recipe: true },
    });

    if (works.length === 0) throw new NotFoundError("No works found");
    res.json(works);
}

export async function getWorkById(req: Request, res: Response) {
    const work = await prisma.work.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            category: true,  // pour savoir si c'est un film, série...
            recipe: true,    // la recette associée à cette œuvre
        },
    });
    if (!work) throw new NotFoundError("Work not found");
    res.json(work);
}