import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { z } from 'zod';
import { NotFoundError, ConflictError, BadRequestError } from '../lib/errors.ts';

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

export async function getAllRecipes(req: Request, res: Response) {
    const { state } = req.query;

    const stateFilter = state
        ? z.enum(["PENDING", "APPROVED", "REJECTED"]).parse(state)
        : undefined;

    const recipes = await prisma.recipe.findMany({
        where: {
            ...(stateFilter && { state: stateFilter }),
        },
        include: {
            work: { include: { category: true } },
            thematics: { include: { thematic: true } },
            user: { select: { id: true, username: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    res.json(recipes);
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
    const { steps, recipeIngredients, thematics, ...scalarData } = updateRecipeSchema.parse(req.body);

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
