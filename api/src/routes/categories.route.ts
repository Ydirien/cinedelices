import { Router } from 'express';
import * as categoriesController from '../controllers/categories.controller.ts';

export const router = Router();

router.get('/categories', categoriesController.getAllCategories);

