import { Router } from 'express';
import { countStatusCV, createCV, getCV, getCVs, updateStatusCV } from '../controllers/cv.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCVSchema, updateCVSchema } from '../validations/cv.validation';

const router = Router();

router.post('/', validate(createCVSchema), createCV);
router.get('/:id', authMiddleware, getCV);
router.get('/', authMiddleware, getCVs);
router.put('/:id', authMiddleware, validate(updateCVSchema), updateStatusCV);
router.get('/stats/status', authMiddleware, countStatusCV);

export default router;
