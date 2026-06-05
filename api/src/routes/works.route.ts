import { Router } from 'express';
import * as worksController from '../controllers/works.controller.ts';

export const router = Router();

router.get('/works', worksController.getAllWorks);
router.get('/works/:id', worksController.getWorkById);