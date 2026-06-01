import { Router } from 'express';
import { router as worksRouter } from './works.route.ts';
import { router as usersRouter } from './users.route.ts';
import { router as authRouter } from './auth.route.ts';
import { router as recipesRouter } from './recipes.route.ts';
import { router as adminRouter } from './admin.route.ts';

export const router = Router();

router.use(authRouter);
router.use(usersRouter);
router.use(worksRouter);
router.use(recipesRouter);
router.use(adminRouter);