import { Router } from 'express';
import * as authController from '../controllers/auth.controller.ts';
import { rateLimiters } from '../middlewares/rate-limit.ts';
import { checkRoles } from '../middlewares/auth.middleware.ts';

export const router = Router();

router.post('/login', rateLimiters.login, authController.loginUser);
router.post('/register', rateLimiters.register, authController.registerUser);
router.post('/logout', checkRoles(['USER', 'ADMIN']), authController.logoutUser);
router.post('/refresh', rateLimiters.refresh, authController.refreshTokens);