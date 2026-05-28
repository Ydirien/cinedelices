import { Router } from 'express';
import * as recipesController from '../controllers/recipes.controller.ts';

export const router = Router();

router.get('/recipes', recipesController.getAllRecipes);
router.get('/recipes/:id', recipesController.getRecipeById);
router.post('/recipes', recipesController.createRecipe);
router.put('/recipes/:id', recipesController.updateRecipe);
router.delete('/recipes/:id', recipesController.deleteRecipe);