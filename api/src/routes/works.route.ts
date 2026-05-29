import { Router } from 'express';
import * as worksController from '../controllers/works.controller.ts';

export const router = Router();

router.get('/work', worksController.getAllWorks);
router.get('/work/:id', worksController.getWorkById);