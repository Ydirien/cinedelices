import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { z } from 'zod';

export async function getAllRecipes(req: Request, res: Response) {
    const recipes = await prisma.recipe.findMany();
    if (recipes.length === 0) {
        return res.status(404).json({ error: "No recipes found" });
    }
    res.json(recipes);
}

export async function getRecipeById(req: Request, res: Response) {
    const { id } = req.params;
    const recipe = await prisma.recipe.findUnique({
        where: { id: Number(id) },
    });
    if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
    }
    res.json(recipe);
}

export async function createRecipe(req: Request, res: Response) {
    try {
        const createRecipeSchema = z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        image: z.string().url(),
        prepTime: z.number().int().positive(),
        cookTime: z.number().int().positive(),
        servings: z.number().int().positive(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
        workId: z.number().int().positive(),
        steps: z.array(
            z.object({
            order: z.number().int().positive(),
            content: z.string().min(1),
            })
        ).min(1),
        recipeIngredients: z.array(
            z.object({
            ingredientId: z.number().int().positive(),
            quantity: z.number().positive(),
            unit: z.string().min(1),
            })
        ).min(1),
        thematics: z.array(z.number().int().positive()).min(1),
        });

    const data = createRecipeSchema.parse(req.body);

    const alreadyExistsRecipe = await prisma.recipe.findFirst({
        where: { title: data.title },
    });

    if (alreadyExistsRecipe) {
        return res.status(400).json({ error: "Recipe already exists" });
    }

    const newRecipe = await prisma.recipe.create({
        data: {
            title: data.title,
            description: data.description,
            image: data.image,
            prepTime: data.prepTime,
            cookTime: data.cookTime,
            servings: data.servings,
            difficulty: data.difficulty,
            workId: data.workId,
            userId: req.user.id,
            steps: {
                create: data.steps,
            },
            recipeIngredients: {
                create: data.recipeIngredients,
            },
            thematics: {
                create: data.thematics.map((thematicId) => ({ thematicId })),
            },
        },
    });

    res.status(201).json(newRecipe);
    } catch (error) {
        if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
        }
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateRecipe(req: Request, res: Response) {
    const recipeId = await parseInt(req.params.id);

    const updateRecipeSchema = z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        image: z.string().url(),
        prepTime: z.number().int().positive(),
        cookTime: z.number().int().positive(),
        servings: z.number().int().positive(),
        difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
        workId: z.number().int().positive(),
        steps: z.array(
            z.object({
            order: z.number().int().positive(),
            content: z.string().min(1),
            })
        ).min(1),
        recipeIngredients: z.array(
            z.object({
            ingredientId: z.number().int().positive(),
            quantity: z.number().positive(),
            unit: z.string().min(1),
            })
        ).min(1),
        thematics: z.array(z.number().int().positive()).min(1),
        });
    
    const { title } = updateRecipeSchema.parse(req.body);

    const foundRecipe = await prisma.recipe.findUnique({
        where: { id: recipeId },
    });

    if (!foundRecipe) {
        return res.status(404).json({ error: "Recipe not found" });
    }

    const alreadyExistsRecipe = await prisma.recipe.findFirst({
        where: { title, id: { not: recipeId } },
    });

    if (alreadyExistsRecipe) {
        return res.status(400).json({ error: "Recipe already exists" });
    }

    const updatedRecipe = await prisma.recipe.update({
        where: { id: recipeId },
        data: { title, updatedAt: new Date() },
    });
    res.json(updatedRecipe);
}

export async function deleteRecipe(req: Request, res: Response) {
    const RecipeId = await parseInt(req.params.id);
    const level = await prisma.level.findUnique({where : { id: RecipeId }});

    if (!level) {
        return res.status(404).json({ error: "Recipe not found" });
    }

    await prisma.recipe.delete({where: {id:levelId}});
    res.status(204).send();
}