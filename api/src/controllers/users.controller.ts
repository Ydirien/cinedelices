import { prisma } from '../models/index.ts';
import type { Request, Response } from 'express';
import z from 'zod';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../lib/errors.ts';

type AuthenticatedRequest = Request & {
  user?: {
    id?: number;
    role?: string;
  };
};

const updateUserSchema = z.object({
  username: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

const userSelect = {
  id: true,
  username: true,
  email: true,
  role: true,
  createdAt: true,
};

function getAuthenticatedUserId(req: Request) {
  const userId = (req as AuthenticatedRequest).user?.id;

  if (!userId) {
    throw new UnauthorizedError('User not authenticated');
  }

  return userId;
}

// GET /users/me
// Récupère le profil de l'utilisateur connecté
export async function getCurrentUser(req: Request, res: Response) {
  const userId = getAuthenticatedUserId(req);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: userSelect,
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  res.json(user);
}

// Ancien nom conservé si tes routes utilisent déjà getUserProfile
export async function getUserProfile(req: Request, res: Response) {
  const userId = getAuthenticatedUserId(req);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: userSelect,
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  res.json(user);
}

// GET /users/:id
// Récupère un utilisateur par son id
export async function getUserById(req: Request, res: Response) {
  const userId = Number(req.params.id);

  if (!Number.isInteger(userId)) {
    throw new NotFoundError('User not found');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: userSelect,
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.json(user);
}

// PATCH /users/me
// Modifie le profil de l'utilisateur connecté
export async function updateUserProfile(req: Request, res: Response) {
  const userId = getAuthenticatedUserId(req);

  const data = await updateUserSchema.parseAsync(req.body);

  if (Object.keys(data).length === 0) {
    throw new BadRequestError('No data provided for update');
  }

  if (data.email) {
    const emailTaken = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: {
          id: userId,
        },
      },
    });

    if (emailTaken) {
      throw new ConflictError('Email already used');
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: userSelect,
  });

  res.json(updatedUser);
}

// DELETE /users/me
// Supprime le compte de l'utilisateur connecté
export async function deleteAccount(req: Request, res: Response) {
  const userId = getAuthenticatedUserId(req);

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  await prisma.$transaction(async (tx) => {
    // On supprime d'abord les recettes de l'utilisateur
    // car la relation Recipe -> User n'a pas forcément de cascade.
    await tx.recipe.deleteMany({
      where: {
        userId,
      },
    });

    await tx.user.delete({
      where: {
        id: userId,
      },
    });
  });

  res.status(204).send();
}

// GET /users/me/liked-recipes
// Récupère les recettes likées par l'utilisateur connecté
export async function getLikedRecipes(req: Request, res: Response) {
  const userId = getAuthenticatedUserId(req);

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    50,
    Math.max(1, parseInt(req.query.limit as string) || 10),
  );
  const skip = (page - 1) * limit;

  const [likes, total] = await Promise.all([
    prisma.like.findMany({
      where: {
        userId,
      },
      include: {
        recipe: {
          include: {
            work: {
              select: {
                id: true,
                title: true,
                image: true,
              },
            },
            user: {
              select: {
                id: true,
                username: true,
              },
            },
            thematics: {
              include: {
                thematic: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),

    prisma.like.count({
      where: {
        userId,
      },
    }),
  ]);

  res.json({
    data: likes.map((like) => like.recipe),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}