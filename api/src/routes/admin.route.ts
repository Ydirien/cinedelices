import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.ts';
import { upload } from '../middlewares/upload.middleware.ts';

export const router = Router();

// À remettre plus tard quand l'auth admin sera fonctionnelle
// router.use(checkRoles(['ADMIN']));


router.get('/admin/dashboard', adminController.getAdminDashboard);

router.get('/admin/recipes', adminController.getAllRecipes);
router.get('/admin/recipes/:id', adminController.getRecipeById);

router.post('/admin/recipes', adminController.createRecipe);

router.patch('/admin/recipes/:id/state', adminController.updateRecipeState);
router.put('/admin/recipes/:id', upload.single('image'), adminController.updateRecipe);
router.delete('/admin/recipes/:id', adminController.deleteRecipe);