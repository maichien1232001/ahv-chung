import { Router } from 'express';
import {
    createMilestone,
    deleteMilestone,
    getMilestone,
    getMilestones,
    updateMilestone,
} from '../controllers/milestone.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createMilestoneSchema, updateMilestoneSchema } from '../validations/milestone.validation';

const router = Router();

router.get('/:id', getMilestone);
router.get('/', getMilestones);
router.post('/', authMiddleware, validate(createMilestoneSchema), createMilestone);
router.put('/:id', authMiddleware, validate(updateMilestoneSchema), updateMilestone);
router.delete('/:id', authMiddleware, deleteMilestone);

export default router;

