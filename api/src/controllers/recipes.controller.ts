import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { z } from 'zod';
import { NotFoundError, ConflictError } from '../lib/errors.ts';

const recipeSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.url(),
    prepTime: z.number().int().positive(),
    cookTime: z.number().int().positive(),
    servings: z.number().int().positive(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    workId: z.number().int().positive(),
    steps: z.array(z.object({
        order: z.number().int().positive(),
        content: z.string().min(1),
    })).min(1),
    recipeIngredients: z.array(z.object({
        ingredientId: z.number().int().positive(),
        quantity: z.number().positive(),
        unit: z.string().min(1),
    })).min(1),
    thematics: z.array(z.number().int().positive()).min(1),
});

export async function getAllRecipes(req: Request, res: Response) {
    const recipes = await prisma.recipe.findMany();
    if (recipes.length === 0) throw new NotFoundError("No recipes found");
    res.json(recipes);
}

export async function getRecipeById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const recipe = await prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new NotFoundError("Recipe not found");
    res.json(recipe);
}

export async function createRecipe(req: Request, res: Response) {
    const data = recipeSchema.parse(req.body);

    const alreadyExists = await prisma.recipe.findFirst({ where: { title: data.title } });
    if (alreadyExists) throw new ConflictError("Recipe already exists");

    const newRecipe = await prisma.recipe.create({
        data: {
            ...data,
            userId: req.user.id,
            steps: { create: data.steps },
            recipeIngredients: { create: data.recipeIngredients },
            thematics: { create: data.thematics.map((thematicId) => ({ thematicId })) },
        },
    });

    res.status(201).json(newRecipe);
}

export async function updateRecipe(req: Request, res: Response) {
    const recipeId = Number(req.params.id);
    const { title } = recipeSchema.parse(req.body);

    const foundRecipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!foundRecipe) throw new NotFoundError("Recipe not found");

    const alreadyExists = await prisma.recipe.findFirst({
        where: { title, id: { not: recipeId } },
    });
    if (alreadyExists) throw new ConflictError("Recipe already exists");

    const updatedRecipe = await prisma.recipe.update({
        where: { id: recipeId },
        data: { title, updatedAt: new Date() },
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