import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { NotFoundError } from '../lib/errors.ts';

export async function getAllCategories(req: Request, res: Response) {
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
        throw new NotFoundError("No categories found");
    }
    res.json(categories);
}

export async function getCategoryById(req: Request, res: Response) {
    const { id } = req.params;
    const category = await prisma.category.findUnique({
        where: { id: Number(id) },
    });
    if (!category) {
        throw new NotFoundError("Category not found");
    }
    res.json(category);
}