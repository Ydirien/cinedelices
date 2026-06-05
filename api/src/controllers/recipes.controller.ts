import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { z } from 'zod';
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from '../lib/errors.ts';
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

const commentSchema = z.object({
    content: z.string().min(1).max(255),
    score: z.number().int().min(1).max(5),
});

// Calcule la note moyenne à partir d'un tableau de commentaires
function computeAvgScore(comments: { score: number }[]) {
    if (comments.length === 0) return null;
    const total = comments.reduce((sum, c) => sum + c.score, 0);
    return Math.round((total / comments.length) * 10) / 10; // arrondi à 1 décimale
}

// GET /recipes
export async function getAllRecipes(req: Request, res: Response) {
    const { category, workId, thematic, difficulty, search, page, limit } = req.query;

    const take = limit ? Number(limit) : 10;
    const skip = page ? (Number(page) - 1) * take : 0;

    // On construit le filtre WHERE dynamiquement selon les query params reçus
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

    // Les deux requêtes en parallèle : données de la page + total pour la pagination
    const [recipes, total] = await Promise.all([
        prisma.recipe.findMany({
            where,
            include: {
                work: { include: { category: true } },
                thematics: { include: { thematic: true } },
                _count: { select: { likes: true, comments: true } },
                // On récupère uniquement les scores pour calculer la moyenne côté serveur
                comments: { select: { score: true } },
            },
            take,
            skip,
        }),
        prisma.recipe.count({ where }),
    ]);

    // On remplace le tableau de scores brut par une moyenne lisible
    const data = recipes.map(({ comments, ...recipe }) => ({
        ...recipe,
        avgScore: computeAvgScore(comments),
    }));

    res.json({
        data,
        total,
        page: page ? Number(page) : 1,
        limit: take,
        totalPages: Math.ceil(total / take),
    });
}

// GET /recipes/:id
export async function getRecipeById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw new NotFoundError("Recipe not found");

    const recipe = await prisma.recipe.findFirst({
        where: { id, state: "APPROVED" },
        include: {
            work: { include: { category: true } },
            thematics: { include: { thematic: true } },
            steps: { orderBy: { order: 'asc' } },
            recipeIngredients: { include: { ingredient: true } },
            _count: { select: { likes: true, comments: true } },
            comments: {
                select: { score: true },
            },
        },
    });

    if (!recipe) throw new NotFoundError("Recipe not found");

    // softAuth hydrate req.user si un token valide est présent, sinon il reste undefined
    let isLiked = false;
    if (req.user) {
        const like = await prisma.like.findUnique({
            where: { userId_recipeId: { userId: req.user.id, recipeId: id } },
        });
        isLiked = !!like;
    }

    const { comments, ...recipeData } = recipe;

    res.json({
        ...recipeData,
        avgScore: computeAvgScore(comments),
        isLiked,
    });
}

// GET /recipes/search?q=ramen
export async function searchRecipes(req: Request, res: Response) {
    const search = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    if (!search) throw new BadRequestError("Le paramètre de recherche est manquant");

    const recipes = await prisma.recipe.findMany({
        where: {
            state: "APPROVED",
            // Recherche dans le titre de la recette, sa description, et le titre de l'œuvre liée
            OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { work: { title: { contains: search, mode: 'insensitive' } } },
            ],
        },
        include: {
            work: { include: { category: true } },
            thematics: { include: { thematic: true } },
        },
    });

    res.json(recipes);
}

// POST /recipes
export async function createRecipe(req: Request, res: Response) {
    const { steps, recipeIngredients, thematics, image: imageUrl, ...scalarData } = recipeSchema.parse(req.body);

    // Fichier uploadé en priorité, sinon URL fournie dans le body
    const image = req.file ? req.file.path.replace(/\\/g, "/") : imageUrl;
    if (!image) throw new BadRequestError("Une image est requise (upload ou URL)");

    const alreadyExists = await prisma.recipe.findFirst({ where: { title: scalarData.title } });
    if (alreadyExists) throw new ConflictError("Recipe already exists");

    // La recette est créée en PENDING — l'admin doit l'approuver avant qu'elle soit visible
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

// POST /recipes/:id/like
export async function likedRecipes(req: Request, res: Response) {
    const recipeId = Number(req.params.id);
    if (!Number.isInteger(recipeId)) throw new NotFoundError("Recipe not found");

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId, state: "APPROVED" } });
    if (!recipe) throw new NotFoundError("Recipe not found");

    const existingLike = await prisma.like.findUnique({
        where: { userId_recipeId: { userId: req.user.id, recipeId } },
    });
    if (existingLike) throw new ConflictError("Recipe already liked");

    await prisma.like.create({ data: { userId: req.user.id, recipeId } });

    res.status(201).json({ message: "Recipe liked" });
}

// DELETE /recipes/:id/like
export async function unlikedRecipes(req: Request, res: Response) {
    const recipeId = Number(req.params.id);
    if (!Number.isInteger(recipeId)) throw new NotFoundError("Recipe not found");

    const existingLike = await prisma.like.findUnique({
        where: { userId_recipeId: { userId: req.user.id, recipeId } },
    });
    if (!existingLike) throw new NotFoundError("Like not found");

    await prisma.like.delete({ where: { userId_recipeId: { userId: req.user.id, recipeId } } });

    res.status(200).json({ message: "Recipe unliked" });
}

// GET /recipes/:id/comments
export async function getRecipeComments(req: Request, res: Response) {
    const recipeId = Number(req.params.id);
    if (!Number.isInteger(recipeId)) throw new NotFoundError("Recipe not found");

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId, state: "APPROVED" } });
    if (!recipe) throw new NotFoundError("Recipe not found");

    const comments = await prisma.comment.findMany({
        where: { recipeId },
        include: { user: { select: { id: true, username: true } } },
        orderBy: { createdAt: "desc" },
    });

    res.json(comments);
}

// POST /recipes/:id/comments
export async function createComment(req: Request, res: Response) {
    const recipeId = Number(req.params.id);
    if (!Number.isInteger(recipeId)) throw new NotFoundError("Recipe not found");

    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId, state: "APPROVED" } });
    if (!recipe) throw new NotFoundError("Recipe not found");

    const { content, score } = commentSchema.parse(req.body);

    // Un user ne peut laisser qu'un seul commentaire + note par recette
    const existingComment = await prisma.comment.findUnique({
        where: { userId_recipeId: { userId: req.user.id, recipeId } },
    });
    if (existingComment) throw new ConflictError("You already commented on this recipe");

    const comment = await prisma.comment.create({
        data: { content, score, userId: req.user.id, recipeId },
        include: { user: { select: { id: true, username: true } } },
    });

    res.status(201).json(comment);
}

// DELETE /comments/:id
export async function deleteComment(req: Request, res: Response) {
    const commentId = Number(req.params.id);
    if (!Number.isInteger(commentId)) throw new NotFoundError("Comment not found");

    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundError("Comment not found");

    // Seul l'auteur du commentaire ou un admin peut le supprimer
    if (comment.userId !== req.user.id && req.user.role !== "ADMIN") {
        throw new ForbiddenError("You can only delete your own comments");
    }

    await prisma.comment.delete({ where: { id: commentId } });

    res.status(200).json({ message: "Comment deleted" });
}
