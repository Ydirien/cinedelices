import { Router } from 'express';
import * as recipesController from '../controllers/recipes.controller.ts';
import { checkRoles } from '../middlewares/auth.middleware.ts';

export const router = Router();

router.get('/recipes', recipesController.getAllRecipes);
router.get('/recipes/:id', recipesController.getRecipeById);
router.post('/recipes', checkRoles(['USER', 'ADMIN']), recipesController.createRecipe);
router.put('/recipes/:id', checkRoles(['USER', 'ADMIN']), recipesController.updateRecipe);
router.delete('/recipes/:id', checkRoles(['USER', 'ADMIN']), recipesController.deleteRecipe);