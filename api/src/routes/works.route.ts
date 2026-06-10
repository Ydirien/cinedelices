import { Router } from 'express';
import * as worksController from '../controllers/works.controller.ts';
import { upload } from '../middlewares/upload.middleware.ts';

export const router = Router();

router.get('/works', worksController.getAllWorks);
router.get('/works/:id', worksController.getWorkById);
router.post('/works',upload.single('image'),worksController.createWork);