import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { NotFoundError } from '../lib/errors.ts';

export async function getAdminDashboard(req: Request, res: Response) {
  const [
    totalRecipes,
    approvedRecipes,
    pendingRecipes,
    totalUsers,
    totalCategories,
    latestPendingRecipes,
  ] = await Promise.all([
    prisma.recipe.count(),
    prisma.recipe.count({ where: { state: 'APPROVED' } }),
    prisma.recipe.count({ where: { state: 'PENDING' } }),
    prisma.user.count(),
    prisma.category.count(),
    prisma.recipe.findMany({
      where: {
        state: 'PENDING',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        work: {
          include: {
            category: true,
          },
        },
      },
    }),
  ]);

  res.json({
    stats: {
      totalRecipes,
      approvedRecipes,
      pendingRecipes,
      totalUsers,
      totalCategories,
    },
    latestPendingRecipes,
  });
}

export async function approveRecipe(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    throw new NotFoundError('Recipe not found');
  }

  const recipe = await prisma.recipe.update({
    where: { id },
    data: {
      state: 'APPROVED',
    },
  });

  res.json(recipe);
}

export async function deleteAdminRecipe(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    throw new NotFoundError('Recipe not found');
  }

  await prisma.recipe.delete({
    where: { id },
  });

  res.status(204).send();
}