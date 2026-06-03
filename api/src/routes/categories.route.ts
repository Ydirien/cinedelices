import { Router } from 'express';
import { getAllCategories } from '../controllers/categories.controller.ts';
import * as categoriesController from '../controllers/categories.controller.ts';

export const router = Router();

router.get('/categories', categoriesController.getAllCategories);

