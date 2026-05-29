import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.ts';
import { checkRoles } from '../middlewares/auth.middleware.ts';

export const router = Router();

// Toutes les routes admin sont protégées par le rôle ADMIN
router.use(checkRoles(['ADMIN']));

router.get('/admin/recipes', adminController.getAllRecipes);
router.patch('/admin/recipes/:id/state', adminController.updateRecipeState);
router.put('/admin/recipes/:id', adminController.updateRecipe);
router.delete('/admin/recipes/:id', adminController.deleteRecipe);
