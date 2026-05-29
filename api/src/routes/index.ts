import { Router , type Request, type Response} from 'express';
import { router as worksRouter } from './works.route.ts';
import { router as usersRouter } from './users.route.ts';
import { router as authRouter } from './auth.route.ts';
import { router as recipesRouter } from './recipes.route.ts';

export const router = Router();

router.get("/error", (req: Request, res: Response) => {
    throw new Error("Mama guette l'erreur copain");
});

router.use(authRouter);
router.use(usersRouter);
router.use(worksRouter);
router.use(recipesRouter);