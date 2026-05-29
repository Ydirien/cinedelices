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

export async function getAllRecipes(req: Request, res: Response) {
    
    // On destructure les query params de l'URL
    // Ex: GET /api/recipes?difficulty=EASY&category=serie&search=ramen
    // Tous sont optionnels — s'ils ne sont pas fournis ils valent undefined
    const { category, workId, thematic, difficulty, search } = req.query;

    const recipes = await prisma.recipe.findMany({
        where: {
            // --- FILTRE PAR OEUVRE PRÉCISE ---
            // Déclenché quand l'utilisateur clique sur une œuvre dans le carousel
            // Ex: ?workId=12 → uniquement les recettes de Naruto (id=12)
            // Si workId est undefined, ce filtre n'est pas ajouté au where
            ...(workId && { workId: Number(workId) }),

            // --- FILTRE PAR DIFFICULTÉ ---
            // Ex: ?difficulty=EASY → uniquement les recettes faciles
            // Le "as Difficulty" est nécessaire car Prisma attend le type enum exact (EASY | MEDIUM | HARD)
            // et non un simple string
            ...(difficulty && { difficulty: String(difficulty) as Difficulty }),

            // --- RECHERCHE PAR TITRE ---
            // Ex: ?search=ramen → toutes les recettes dont le titre contient "ramen"
            // mode: 'insensitive' = insensible à la casse ("Ramen" = "ramen" = "RAMEN")
            // contains = LIKE '%ramen%' en SQL
            ...(search && { title: { contains: String(search), mode: 'insensitive' } }),

            // --- FILTRE PAR TYPE D'OEUVRE ---
            // Ex: ?category=serie → toutes les recettes dont l'œuvre associée est une série
            // On ne filtre pas directement sur Recipe, on remonte la relation :
            // Recipe → Work → Category → name
            // C'est Prisma qui fait la jointure SQL automatiquement
            ...(category && {
                work: {
                    category: {
                        name: { equals: String(category), mode: 'insensitive' }
                    }
                }
            }),

            // --- FILTRE PAR THÉMATIQUE (Entrée, Plat, Dessert...) ---
            // Ex: ?thematic=dessert → toutes les recettes taguées "dessert"
            // "some" = au moins une thématique correspond (une recette peut en avoir plusieurs)
            // On passe par la table de jointure RecipeThematic :
            // Recipe → RecipeThematic → Thematic → name
            ...(thematic && {
                thematics: {
                    some: {
                        thematic: {
                            name: { equals: String(thematic), mode: 'insensitive' }
                        }
                    }
                }
            }),
        },

        // --- RELATIONS INCLUSES ---
        // Sans "include", Prisma retourne uniquement les colonnes de la table recipe
        // avec include on récupère aussi les données des tables liées en une seule requête
        // ce qui évite au front de faire des appels supplémentaires
        include: {
            // Inclut l'œuvre associée + sa catégorie (film, série, animé...)
            // Ex: { work: { title: "Naruto", category: { name: "Animé" } } }
            work: {
                include: { category: true }
            },
            // Inclut les thématiques de la recette via la table de jointure
            // Ex: { thematics: [{ thematic: { name: "Dessert" } }] }
            thematics: {
                include: { thematic: true }
            },
        },
    });

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