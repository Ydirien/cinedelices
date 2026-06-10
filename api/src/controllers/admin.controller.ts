import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { z } from 'zod';
import { NotFoundError, ConflictError } from '../lib/errors.ts';

const updateRecipeSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    image: z.url().optional(),
    prepTime: z.number().int().positive().optional(),
    cookTime: z.number().int().positive().optional(),
    servings: z.number().int().positive().optional(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
    workId: z.number().int().positive().optional(),
    steps: z.array(z.object({
        order: z.number().int().positive(),
        content: z.string().min(1),
    })).min(1).optional(),
    recipeIngredients: z.array(z.object({
        ingredientId: z.number().int().positive(),
        quantity: z.number().positive(),
        unit: z.string().min(1),
    })).min(1).optional(),
    thematics: z.array(z.number().int().positive()).min(1).optional(),
});

const updateStateSchema = z.object({
    state: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

const createRecipeSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.url(),
  prepTime: z.number().int().positive(),
  cookTime: z.number().int().positive(),
  servings: z.number().int().positive(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  state: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  workId: z.number().int().positive(),

  steps: z.array(
    z.object({
      order: z.number().int().positive(),
      content: z.string().min(1),
    }),
  ),

  recipeIngredients: z.array(
    z.object({
      ingredientId: z.number().int().positive(),
      quantity: z.number().positive(),
      unit: z.string().min(1),
    }),
  ),

  thematics: z.array(z.number().int().positive()),
});

// GET /admin/recipes?state=PENDING&page=1&limit=10
export async function getAllRecipes(req: Request, res: Response) {
    const { state, page, limit } = req.query;

    const stateFilter = state
        ? z.enum(["PENDING", "APPROVED", "REJECTED"]).parse(state)
        : undefined;

    // Nombre de recettes par page (défaut 10), et nombre à sauter selon la page demandée
    const take = limit ? Number(limit) : 10;
    const skip = page ? (Number(page) - 1) * take : 0;

    const where = {
        ...(stateFilter && { state: stateFilter }),
    };

    // On lance les deux requêtes en parallèle : les recettes de la page + le total pour calculer les pages
    const [recipes, total] = await Promise.all([
        prisma.recipe.findMany({
            where,
            include: {
                work: { include: { category: true } },
                thematics: { include: { thematic: true } },
                user: { select: { id: true, username: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
            take,
            skip,
        }),
        prisma.recipe.count({ where }),
    ]);

    res.json({
        data: recipes,
        total,                               // nombre total de recettes (tous filtres confondus)
        page: page ? Number(page) : 1,
        limit: take,
        totalPages: Math.ceil(total / take), // nombre de pages disponibles
    });
}

export async function updateRecipeState(req: Request, res: Response) {
    const recipeId = Number(req.params.id);
    const { state } = updateStateSchema.parse(req.body);

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) throw new NotFoundError("Recipe not found");

    const updatedRecipe = await prisma.recipe.update({
        where: { id: recipeId },
        data: { state },
    });

    res.json(updatedRecipe);
}

export async function updateRecipe(req: Request, res: Response) {
    const recipeId = Number(req.params.id);
    const { steps, recipeIngredients, thematics, image: imageUrl, ...scalarData } = updateRecipeSchema.parse(req.body);

    const image = req.file ? req.file.path.replace(/\\/g, "/") : imageUrl;

    const foundRecipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!foundRecipe) throw new NotFoundError("Recipe not found");

    if (scalarData.title) {
        const alreadyExists = await prisma.recipe.findFirst({
            where: { title: scalarData.title, id: { not: recipeId } },
        });
        if (alreadyExists) throw new ConflictError("Recipe title already exists");
    }

    const updatedRecipe = await prisma.recipe.update({
        where: { id: recipeId },
        data: {
            ...scalarData,
            ...(image && { image }),
            ...(steps && { steps: { deleteMany: {}, create: steps } }),
            ...(recipeIngredients && { recipeIngredients: { deleteMany: {}, create: recipeIngredients } }),
            ...(thematics && { thematics: { deleteMany: {}, create: thematics.map((thematicId) => ({ thematicId })) } }),
        },
    });

    res.json(updatedRecipe);
}

export async function deleteRecipe(req: Request, res: Response) {
    const recipeId = Number(req.params.id);

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) throw new NotFoundError("Recipe not found");

    await prisma.recipe.delete({ where: { id: recipeId } });
    res.status(204).send();
}

export async function getRecipeById(req: Request, res: Response) {
    const recipeId = Number(req.params.id);

    const recipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
        include: {
            work: { include: { category: true } },
            thematics: { include: { thematic: true } },
            steps: { orderBy: { order: "asc" } },
            recipeIngredients: { include: { ingredient: true } },
            user: { select: { id: true, username: true, email: true } },
            _count: { select: { likes: true, comments: true } },
        },
    });

    if (!recipe) throw new NotFoundError("Recipe not found");

    res.json(recipe);
}

// Controller du tableau de bord administrateur
// Il permet de récupérer plusieurs statistiques utiles pour l'espace admin
export async function getAdminDashboard(req: Request, res: Response) {
    // Promise.all permet de lancer plusieurs requêtes Prisma en même temps
    // Cela évite d'attendre chaque requête une par une
    const [
        totalRecipes,
        approvedRecipes,
        pendingRecipes,
        totalUsers,
        totalCategories,
        latestPendingRecipes,
    ] = await Promise.all([
        // Nombre total de recettes en base
        prisma.recipe.count(),

        // Nombre de recettes validées
        prisma.recipe.count({
        where: {
            state: 'APPROVED',
        },
        }),

        // Nombre de recettes en attente de validation
        prisma.recipe.count({
        where: {
            state: 'PENDING',
        },
        }),

        // Nombre total d'utilisateurs inscrits
        prisma.user.count(),

        // Nombre total de catégories disponibles
        prisma.category.count(),

        // Récupération des 5 dernières recettes en attente de validation
        prisma.recipe.findMany({
        where: {
            state: 'PENDING',
        },

        // On affiche les plus récentes en premier
        orderBy: {
            createdAt: 'desc',
        },

        // On limite volontairement à 5 recettes pour le dashboard
        take: 5,

        // On inclut certaines relations utiles pour l'affichage côté front
        include: {
            // Utilisateur ayant proposé la recette
            user: {
            select: {
                id: true,
                email: true,
            },
            },

            // Œuvre liée à la recette avec sa catégorie
            work: {
            include: {
                category: true,
            },
            },
        },
        }),
    ]);

    // Réponse envoyée au front
    // Elle contient les statistiques + les dernières recettes en attente
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
  const {
    steps,
    recipeIngredients,
    thematics,
    state,
    ...scalarData
  } = createRecipeSchema.parse(req.body);

  const alreadyExists = await prisma.recipe.findFirst({
    where: {
      title: scalarData.title,
    },
  });

  if (alreadyExists) {
    throw new ConflictError('Recipe already exists');
  }

  const newRecipe = await prisma.recipe.create({
    data: {
      ...scalarData,

      userId: req.user.id,

      // En admin, on peut choisir le statut directement.
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
    },
  });

  res.status(201).json(newRecipe);
}
