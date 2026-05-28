import { Router } from 'express';
import { getPaperById } from '../controllers/paper.controller';

const router = Router();

router.get('/:id', getPaperById);

export default router;