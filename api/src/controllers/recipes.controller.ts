import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { z } from 'zod';
import { NotFoundError, ConflictError } from '../lib/errors.ts';
import type { Difficulty } from '../../prisma/generated/client.js';

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

// MVP : page liste — retourne les recettes approuvées avec filtres optionnels
// GET /recipes?difficulty=EASY&category=serie&search=ramen&thematic=dessert&workId=12
export async function getAllRecipes(req: Request, res: Response) {
    const { category, workId, thematic, difficulty, search } = req.query;

    const recipes = await prisma.recipe.findMany({
        where: {
            state: "APPROVED",
            ...(workId && { workId: Number(workId) }),
            ...(difficulty && { difficulty: difficulty as Difficulty }),
            ...(search && { title: { contains: String(search), mode: 'insensitive' } }),
            ...(category && {
                work: {
                    category: { name: { equals: String(category), mode: 'insensitive' } },
                },
            }),
            ...(thematic && {
                thematics: {
                    some: {
                        thematic: { name: { equals: String(thematic), mode: 'insensitive' } },
                    },
                },
            }),
        },
        include: {
            // MVP : film ou série associé (affiché sur la carte recette)
            work: { include: { category: true } },
            thematics: { include: { thematic: true } },
        },
    });

    res.json(recipes);
}

// MVP : page détail d'une recette — retourne toutes les données nécessaires à l'affichage
export async function getRecipeById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new NotFoundError("Recipe not found");

    const recipe = await prisma.recipe.findUnique({
        where: { id, state: "APPROVED" },
        include: {
            // MVP : film ou série associé à la recette
            work: { include: { category: true } },
            thematics: { include: { thematic: true } },
            // MVP : instructions de préparation étape par étape, triées par ordre
            steps: { orderBy: { order: 'asc' } },
            // MVP : ingrédients avec nom, quantité et unité (ex: "200g de farine")
            recipeIngredients: { include: { ingredient: true } },
        },
    });

    if (!recipe) throw new NotFoundError("Recipe not found");

    // MVP : le champ description couvre les informations complémentaires (anecdotes, contexte)
    res.json(recipe);
}

export async function createRecipe(req: Request, res: Response) {
    // On sépare les relations (steps, ingredients, thematics) des champs scalaires
    // car Prisma attend une syntaxe différente pour les relations
    const { steps, recipeIngredients, thematics, ...scalarData } = recipeSchema.parse(req.body);

    const alreadyExists = await prisma.recipe.findFirst({ where: { title: scalarData.title } });
    if (alreadyExists) throw new ConflictError("Recipe already exists");

    // MVP : la recette est créée en PENDING — l'admin doit l'approuver pour qu'elle soit visible
    const newRecipe = await prisma.recipe.create({
        data: {
            ...scalarData,
            userId: req.user.id,
            state: "PENDING",
            steps: { create: steps },
            recipeIngredients: { create: recipeIngredients },
            thematics: { create: thematics.map((thematicId) => ({ thematicId })) },
        },
    });

    res.status(201).json(newRecipe);
}
