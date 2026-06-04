import { Router } from 'express';
import * as recipesController from '../controllers/recipes.controller.ts';
import { checkRoles } from '../middlewares/auth.middleware.ts';
import { upload } from '../middlewares/upload.middleware.ts';

export const router = Router();

router.get('/recipes', recipesController.getAllRecipes);
router.get('/recipes/:id', recipesController.getRecipeById);
router.post('/recipes', checkRoles(['USER', 'ADMIN']) , upload.single('image'), recipesController.createRecipe);
