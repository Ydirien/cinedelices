import type { Request, Response } from 'express';
import { prisma } from '../models/index.ts';

export async function getAllTypes(req:Request, res:Response) {
    const types = await prisma.thematic.findMany()
    res.status(200).json(types);
};