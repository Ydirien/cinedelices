import { Router } from 'express';
import { router as worksRouter } from './works.route.ts';
import { router as usersRouter } from './users.route.ts';
import { router as authRouter } from './auth.route.ts';
import { router as recipesRouter } from './recipes.route.ts';
import { router as adminRouter } from './admin.route.ts';
import { router as categoriesRouter } from './categories.route.ts';
import { router as typesRouter } from './types.route.ts';

export const router = Router();

router.get('/health', (_, res) => res.json({ status: 'ok' }));

router.use(authRouter);
router.use(usersRouter);
router.use(worksRouter);
router.use(recipesRouter);
router.use(adminRouter);
router.use(categoriesRouter);
router.use(typesRouter);

