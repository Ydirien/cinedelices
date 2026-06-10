import { Router } from 'express';
import * as UsersController from '../controllers/users.controller.ts';
import { checkRoles } from '../middlewares/auth.middleware.ts';

export const router = Router();

router.get('/profile', checkRoles(['USER', 'ADMIN']), UsersController.getUserProfile);
router.put('/profile', checkRoles(['USER', 'ADMIN']), UsersController.updateUserProfile);
router.delete('/profile', checkRoles(['USER', 'ADMIN']), UsersController.deleteAccount);
router.get('/profile/likes', checkRoles(['USER', 'ADMIN']), UsersController.getLikedRecipes);