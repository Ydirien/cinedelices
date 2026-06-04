import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { z } from 'zod';
import { NotFoundError, ConflictError, BadRequestError } from '../lib/errors.ts';
import type { Difficulty } from '../../prisma/generated/client.js';

const recipeSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.url().optional(),
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
// GET /recipes?difficulty=EASY&category=serie&search=ramen&thematic=dessert&workId=12&page=1&limit=10
export async function getAllRecipes(req: Request, res: Response) {
    const { category, workId, thematic, difficulty, search, page, limit } = req.query;

    // Nombre de recettes par page (défaut 10), et nombre à sauter selon la page demandée
    const take = limit ? Number(limit) : 10;
    const skip = page ? (Number(page) - 1) * take : 0;

    // On isole le filtre WHERE pour le réutiliser dans le count (évite de le dupliquer)
    const where = {
        state: "APPROVED" as const,
        ...(workId && { workId: Number(workId) }),
        ...(difficulty && { difficulty: difficulty as Difficulty }),
        ...(search && { title: { contains: String(search), mode: 'insensitive' as const } }),
        ...(category && {
            work: { category: { name: { equals: String(category), mode: 'insensitive' as const } } },
        }),
        ...(thematic && {
            thematics: { some: { thematic: { name: { equals: String(thematic), mode: 'insensitive' as const } } } },
        }),
    };

    // On lance les deux requêtes en parallèle : les recettes de la page + le total pour calculer les pages
    const [recipes, total] = await Promise.all([
        prisma.recipe.findMany({
            where,
            include: {
                // MVP : film ou série associé (affiché sur la carte recette)
                work: { include: { category: true } },
                thematics: { include: { thematic: true } },
            },
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
    const { steps, recipeIngredients, thematics, image: imageUrl, ...scalarData } = recipeSchema.parse(req.body);

    // Fichier uploadé en priorité, sinon URL fournie dans le body
    const image = req.file ? req.file.path.replace(/\\/g, "/") : imageUrl;
    if (!image) throw new BadRequestError("Une image est requise (upload ou URL)");

    const alreadyExists = await prisma.recipe.findFirst({ where: { title: scalarData.title } });
    if (alreadyExists) throw new ConflictError("Recipe already exists");

    // MVP : la recette est créée en PENDING — l'admin doit l'approuver pour qu'elle soit visible
    const newRecipe = await prisma.recipe.create({
        data: {
            ...scalarData,
            image,
            userId: req.user.id,
            state: "PENDING",
            steps: { create: steps },
            recipeIngredients: { create: recipeIngredients },
            thematics: { create: thematics.map((thematicId) => ({ thematicId })) },
        },
    });

    res.status(201).json(newRecipe);
}

// Recherche dédiée pour la SearchPage
// GET /api/recipes/search?q=game
export async function searchRecipes(req: Request, res: Response) {
    // Je récupère le mot tapé dans la barre de recherche
    const search = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    // Si aucun mot n'est envoyé, je retourne une erreur claire
    if (!search) {
        return res.status(400).json({
            message: 'Le paramètre de recherche est manquant.',
        });
    }

    // Je cherche les recettes approuvées contenant le mot recherché :
    // - dans le titre de la recette
    // - dans la description de la recette
    // - dans le titre de l'œuvre liée à la recette
    const recipes = await prisma.recipe.findMany({
        where: {
            state: "APPROVED",
            OR: [
                {
                    title: {
                        contains: search,
                        mode: 'insensitive' as const,
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive' as const,
                    },
                },
                {
                    work: {
                        is: {
                            title: {
                                contains: search,
                                mode: 'insensitive' as const,
                            },
                        },
                    },
                },
            ],
        },
        include: {
            // Je récupère aussi l'œuvre liée pour pouvoir l'utiliser côté front si besoin
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
        },
    });

    res.json(recipes);
}