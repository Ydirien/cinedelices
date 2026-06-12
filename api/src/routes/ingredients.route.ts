import { Router } from 'express';
import * as ingredientsController from '../controllers/ingredients.controller.ts'

export const router = Router();

router.get('/ingredients', ingredientsController.getAllIngredients);     
router.get('/ingredients/search', ingredientsController.searchIngredientsByName);
router.post('/ingredients', ingredientsController.createIngredient);