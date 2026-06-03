import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';

export async function getAllCategories(req:Request, res:Response) {
    const categories = await prisma.category.findMany()
    res.status(200).json(categories);
};