import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { z } from 'zod';
import { NotFoundError, ConflictError } from '../lib/errors.ts';

type AuthenticatedRequest = Request & {
  user?: {
    id: number;
    role?: string;
  };
  file?: {
    path: string;
  };
};

const positiveIntSchema = z.coerce.number().int().positive();
const positiveNumberSchema = z.coerce.number().positive();

const updateRecipeSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  image: z.string().min(1).optional(),
  prepTime: positiveIntSchema.optional(),
  cookTime: positiveIntSchema.optional(),
  servings: positiveIntSchema.optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  workId: positiveIntSchema.optional(),

  steps: z
    .array(
      z.object({
        order: positiveIntSchema,
        content: z.string().min(1),
      }),
    )
    .optional(),

  recipeIngredients: z
    .array(
      z.object({
        ingredientId: positiveIntSchema,
        quantity: positiveNumberSchema,
        unit: z.string().min(1),
      }),
    )
    .optional(),

  thematics: z.array(positiveIntSchema).optional(),
});

const updateStateSchema = z.object({
  state: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
});

const createRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
  prepTime: positiveIntSchema,
  cookTime: positiveIntSchema,
  servings: positiveIntSchema,
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  state: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  workId: positiveIntSchema,

  steps: z.array(
    z.object({
      order: positiveIntSchema,
      content: z.string().min(1),
    }),
  ),

  recipeIngredients: z.array(
    z.object({
      ingredientId: positiveIntSchema,
      quantity: positiveNumberSchema,
      unit: z.string().min(1),
    }),
  ),

  thematics: z.array(positiveIntSchema),
});


// GET /admin/recipes?state=PENDING&page=1&limit=10
export async function getAllRecipes(req: Request, res: Response) {
  const { state, page, limit } = req.query;

  const stateFilter = state
    ? z.enum(['PENDING', 'APPROVED', 'REJECTED']).parse(state)
    : undefined;

  const take = limit ? Number(limit) : 10;
  const skip = page ? (Number(page) - 1) * take : 0;

  const where = {
    ...(stateFilter && { state: stateFilter }),
  };

  const [recipes, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      include: {
        work: {
          include: {
            category: true,
          },
        },
        thematics: {
          include: {
            thematic: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
    }),

    prisma.recipe.count({
      where,
    }),
  ]);

  res.json({
    data: recipes,
    total,
    page: page ? Number(page) : 1,
    limit: take,
    totalPages: Math.ceil(total / take),
  });
}

export async function getRecipeById(req: Request, res: Response) {
  const recipeId = Number(req.params.id);

  if (!Number.isInteger(recipeId)) {
    throw new NotFoundError('Recipe not found');
  }

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
    include: {
      work: {
        include: {
          category: true,
        },
      },
      thematics: {
        include: {
          thematic: true,
        },
      },
      steps: {
        orderBy: {
          order: 'asc',
        },
      },
      recipeIngredients: {
        include: {
          ingredient: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  if (!recipe) {
    throw new NotFoundError('Recipe not found');
  }

  res.json(recipe);
}

export async function updateRecipeState(req: Request, res: Response) {
  const recipeId = Number(req.params.id);

  if (!Number.isInteger(recipeId)) {
    throw new NotFoundError('Recipe not found');
  }

  const { state } = updateStateSchema.parse(req.body);

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  });

  if (!recipe) {
    throw new NotFoundError('Recipe not found');
  }

  const updatedRecipe = await prisma.recipe.update({
    where: {
      id: recipeId,
    },
    data: {
      state,
    },
  });

  res.json(updatedRecipe);
}

export async function updateRecipe(req: Request, res: Response) {
  const recipeId = Number(req.params.id);

  if (!Number.isInteger(recipeId)) {
    throw new NotFoundError('Recipe not found');
  }

  const typedReq = req as AuthenticatedRequest;

  const {
    steps,
    recipeIngredients,
    thematics,
    image: imageUrl,
    ...scalarData
  } = updateRecipeSchema.parse(req.body);

  const image = typedReq.file ? typedReq.file.path.replace(/\\/g, '/') : imageUrl;

  const foundRecipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  });

  if (!foundRecipe) {
    throw new NotFoundError('Recipe not found');
  }

  if (scalarData.title) {
    const alreadyExists = await prisma.recipe.findFirst({
      where: {
        title: scalarData.title,
        id: {
          not: recipeId,
        },
      },
    });

    if (alreadyExists) {
      throw new ConflictError('Recipe title already exists');
    }
  }

  const updatedRecipe = await prisma.recipe.update({
    where: {
      id: recipeId,
    },
    data: {
      ...scalarData,

      ...(image && {
        image,
      }),

      ...(steps && {
        steps: {
          deleteMany: {},
          create: steps,
        },
      }),

      ...(recipeIngredients && {
        recipeIngredients: {
          deleteMany: {},
          create: recipeIngredients,
        },
      }),

      ...(thematics && {
        thematics: {
          deleteMany: {},
          create: thematics.map((thematicId) => ({
            thematicId,
          })),
        },
      }),
    },
    include: {
      work: {
        include: {
          category: true,
        },
      },
      thematics: {
        include: {
          thematic: true,
        },
      },
      steps: {
        orderBy: {
          order: 'asc',
        },
      },
      recipeIngredients: {
        include: {
          ingredient: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  res.json(updatedRecipe);
}

export async function deleteRecipe(req: Request, res: Response) {
  const recipeId = Number(req.params.id);

  if (!Number.isInteger(recipeId)) {
    throw new NotFoundError('Recipe not found');
  }

  const recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
    },
  });

  if (!recipe) {
    throw new NotFoundError('Recipe not found');
  }

  await prisma.recipe.delete({
    where: {
      id: recipeId,
    },
  });

  res.status(204).send();
}

// Controller du tableau de bord administrateur
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

    prisma.recipe.count({
      where: {
        state: 'APPROVED',
      },
    }),

    prisma.recipe.count({
      where: {
        state: 'PENDING',
      },
    }),

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

export async function createRecipe(req: Request, res: Response) {
  const typedReq = req as AuthenticatedRequest;

  const { steps, recipeIngredients, thematics, state, ...scalarData } =
    createRecipeSchema.parse(req.body);

  const alreadyExists = await prisma.recipe.findFirst({
    where: {
      title: scalarData.title,
    },
  });

  if (alreadyExists) {
    throw new ConflictError('Recipe already exists');
  }

  const userId = typedReq.user?.id ?? 1;

  const newRecipe = await prisma.recipe.create({
    data: {
      ...scalarData,

      userId,

      state: state ?? 'APPROVED',

      steps: {
        create: steps,
      },

      recipeIngredients: {
        create: recipeIngredients,
      },

      thematics: {
        create: thematics.map((thematicId) => ({
          thematicId,
        })),
      },
    },
    include: {
      work: {
        include: {
          category: true,
        },
      },
      thematics: {
        include: {
          thematic: true,
        },
      },
      steps: {
        orderBy: {
          order: 'asc',
        },
      },
      recipeIngredients: {
        include: {
          ingredient: true,
        },
      },
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  res.status(201).json(newRecipe);
}

export async function getAllUsers(req: Request, res: Response) {
    const { role, page, limit } = req.query;

    const roleFilter = role
        ? z.enum(["USER", "ADMIN"]).parse(role)
        : undefined;

    const take = limit ? Number(limit) : 10;
    const skip = page ? (Number(page) - 1) * take : 0;

    const where = {
        ...(roleFilter && { role: roleFilter }),
    };

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            omit: { password: true },
            include: {
                _count: { select: { recipes: true, likes: true, comments: true } },
            },
            orderBy: { createdAt: "desc" },
            take,
            skip,
        }),
        prisma.user.count({ where }),
    ]);

    res.json({
        data: users,
        total,
        page: page ? Number(page) : 1,
        limit: take,
        totalPages: Math.ceil(total / take),
    });
}

const updateUserRoleSchema = z.object({
    role: z.enum(["USER", "ADMIN"]),
});

export async function updateUserRole(req: Request, res: Response) {
    const targetId = Number(req.params.id);
    const { role } = updateUserRoleSchema.parse(req.body);

    if (targetId === req.user.id) {
        throw new ConflictError("Cannot change your own role");
    }

    const user = await prisma.user.findUnique({ where: { id: targetId } });
    if (!user) throw new NotFoundError("User not found");

    const updatedUser = await prisma.user.update({
        where: { id: targetId },
        data: { role },
        omit: { password: true },
    });

    res.json(updatedUser);
}

export async function deleteUser(req: Request, res: Response) {
    const targetId = Number(req.params.id);

    if (targetId === req.user.id) {
        throw new ConflictError("Cannot delete your own account");
    }

    const user = await prisma.user.findUnique({ where: { id: targetId } });
    if (!user) throw new NotFoundError("User not found");

    await prisma.$transaction(async (tx) => {
        await tx.recipe.deleteMany({ where: { userId: targetId } });
        await tx.user.delete({ where: { id: targetId } });
    });

    res.status(204).send();
}
