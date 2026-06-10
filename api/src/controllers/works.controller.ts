import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';
import { NotFoundError, BadRequestError } from '../lib/errors.ts';

export async function getAllWorks(req: Request, res: Response) {
    const { category } = req.query;

    const works = await prisma.work.findMany({
        where: {
            ...(category && { category: { name: { equals: String(category), mode: 'insensitive' } } }),
        },
        include: { category: true, recipe: true },
    });

    if (works.length === 0) throw new NotFoundError("No works found");
    res.json(works);
}

export async function getWorkById(req: Request, res: Response) {
    const work = await prisma.work.findUnique({
        where: { id: Number(req.params.id) },
        include: {
            category: true,  // pour savoir si c'est un film, série...
            recipe: true,    // la recette associée à cette œuvre
        },
    });
    if (!work) throw new NotFoundError("Work not found");
    res.json(work);
}

// creations d'une Oeuvre
export async function createWork(req: Request, res: Response) {
  try {

    // Affiche les données reçues depuis le frontend
    console.log("BODY", req.body);

    // Affiche le fichier uploadé par multer
    console.log("FILE", req.file);

   const { title, releaseYear, synopsis } = req.body;
const rawCategoryId = req.body.categoryId;
const categoryId = Array.isArray(rawCategoryId) ? rawCategoryId[0] : rawCategoryId;

    // on récupère son chemin et on remplace les "\" windows par "/"
    const image = req.file
      ? req.file.path.replace(/\\/g, "/")
      : null;

    // Sécurité : impossible de créer une œuvre sans image
    if (!image) {
      return res.status(400).json({
        message: "Image manquante",
      });
    }

    // Création de l'œuvre dans la base de données avec Prisma
    const work = await prisma.work.create({
      data: {
        title,
        releaseYear: Number(releaseYear),
        synopsis,
        image,
        categoryId: Number(categoryId),
      },
    });

    return res.status(201).json(work);

  } catch (err) {

    console.error("CREATE WORK ERROR");
    console.error(err);

    return res.status(500).json({
      message: "Crash serveur",
      error: String(err),
    });
  }
}