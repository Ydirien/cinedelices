import { Router } from 'express';

import {
  getAdminDashboard,
  approveRecipe,
  deleteAdminRecipe,
} from '../controllers/adminDashboard.controller.ts';

const router = Router();

router.get('/dashboard', getAdminDashboard);
router.patch('/recipes/:id/approve', approveRecipe);
router.delete('/recipes/:id', deleteAdminRecipe);

export default router;