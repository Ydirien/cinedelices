import { Router } from 'express';
import * as authController from '../controllers/auth.controller.ts';

export const router = Router();

router.post('/login', authController.loginUser);
router.post('/register', authController.registerUser);
router.post('/logout', authController.logoutUser);