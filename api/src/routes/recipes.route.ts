import { Router } from 'express';
import * as recipesController from '../controllers/recipes.controller.ts';
import { checkRoles, softAuth } from '../middlewares/auth.middleware.ts';
import { upload } from '../middlewares/upload.middleware.ts';

export const router = Router();

router.get('/recipes/search', recipesController.searchRecipes);
router.get('/recipes', recipesController.getAllRecipes);
router.get('/recipes/:id', softAuth, recipesController.getRecipeById);
router.post('/recipes',checkRoles(['USER', 'ADMIN']),upload.single('image'),recipesController.createRecipe);

// Route des favoris
router.post('/recipes/:id/like', checkRoles(['USER', 'ADMIN']), recipesController.likedRecipes);
router.delete('/recipes/:id/like', checkRoles(['USER', 'ADMIN']), recipesController.unlikedRecipes);

// Route des commentaires + rating
router.get('/recipes/:id/comments', recipesController.getRecipeComments);
router.post('/recipes/:id/comments', checkRoles(['USER', 'ADMIN']), recipesController.createComment);
router.delete('/comments/:id', checkRoles(['USER', 'ADMIN']), recipesController.deleteComment);