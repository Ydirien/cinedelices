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