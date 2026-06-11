import { Router } from 'express';
import * as UsersController from '../controllers/users.controller.ts';
import { checkRoles } from '../middlewares/auth.middleware.ts';

export const router = Router();

router.get('/profile', checkRoles(['USER', 'ADMIN']), UsersController.getUserProfile);
router.put('/profile', checkRoles(['USER', 'ADMIN']), UsersController.updateUserProfile);
router.patch('/profile/password', checkRoles(['USER', 'ADMIN']), UsersController.changePassword);
router.delete('/profile', checkRoles(['USER', 'ADMIN']), UsersController.deleteAccount);
router.get('/profile/recipes', checkRoles(['USER', 'ADMIN']), UsersController.getOwnRecipes);
router.get('/profile/likes', checkRoles(['USER', 'ADMIN']), UsersController.getLikedRecipes);