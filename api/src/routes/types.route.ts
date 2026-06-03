import { Router } from 'express';
import * as typesController from '../controllers/types.controller.ts'

export const router = Router();

router.get('/types', typesController.getAllTypes);