import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';

export async function getAllIngredients(req: Request, res: Response) {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  res.json(ingredients);
}

export async function searchIngredientsByName(req: Request, res: Response) {
  const { name } = req.query;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Query parameter "name" is required' });
  }

  const ingredients = await prisma.ingredient.findMany({
    where: {
      name: { contains: name, mode: 'insensitive' },
    },
    orderBy: { name: 'asc' },
    take: 10,
  });

  res.json(ingredients);
}

export async function createIngredient(req: Request, res: Response) {
  const { name } = req.body;

  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Le nom est requis' });
  }

  const existing = await prisma.ingredient.findUnique({ where: { name } });
  if (existing) return res.json(existing);

  const ingredient = await prisma.ingredient.create({
    data: {
      name,
      image: '',
    },
  });

  res.status(201).json(ingredient);
}
