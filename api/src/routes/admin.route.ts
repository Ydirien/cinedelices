import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.ts';
import { checkRoles } from '../middlewares/auth.middleware.ts';
import { upload } from '../middlewares/upload.middleware.ts';

export const router = Router();

// Toutes les routes admin sont protégées par le rôle ADMIN
router.use(checkRoles(['ADMIN']));

router.get('/admin/recipes', adminController.getAllRecipes);
router.patch('/admin/recipes/:id/state', adminController.updateRecipeState);
router.put('/admin/recipes/:id', upload.single('image'),adminController.updateRecipe);
router.delete('/admin/recipes/:id', adminController.deleteRecipe);
