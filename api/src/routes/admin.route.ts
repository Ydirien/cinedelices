import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.ts';
import { checkRoles } from '../middlewares/auth.middleware.ts';
import { upload } from '../middlewares/upload.middleware.ts';

export const router = Router();

// Toutes les routes de ce fichier sont réservées aux administrateurs
router.use(checkRoles(['ADMIN']));

// Dashboard admin
router.get('/admin/dashboard', adminController.getAdminDashboard);

// Gestion des recettes
router.get('/admin/recipes', adminController.getAllRecipes);
router.get('/admin/recipes/:id', adminController.getRecipeById);

router.post('/admin/recipes', adminController.createRecipe);

router.patch('/admin/recipes/:id/state', adminController.updateRecipeState);
router.put('/admin/recipes/:id', upload.single('image'), adminController.updateRecipe);
router.delete('/admin/recipes/:id', adminController.deleteRecipe);

router.get('/admin/users', adminController.getAllUsers);
router.patch('/admin/users/:id/role', adminController.updateUserRole);
router.delete('/admin/users/:id', adminController.deleteUser);