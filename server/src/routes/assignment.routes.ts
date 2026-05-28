import { Router } from 'express';
import { createAssignment, deleteAssignmentById, getAssignmentById, getAssignments } from '../controllers/assignment.controller';

const router = Router();

router.get('/', getAssignments);
router.delete('/delete/:id', deleteAssignmentById);
router.get('/:id', getAssignmentById);
router.post('/generate', createAssignment);

export default router;