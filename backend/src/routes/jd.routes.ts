import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createJD, deleteJD, getJD, getJDs, updateJD } from '../controllers/jd.controller';
import { validate } from '../middlewares/validate.middleware';
import { createJDSchema, updateJDSchema } from '../validations/jd.validation';

const router = Router();

router.post('/', authMiddleware, validate(createJDSchema), createJD);
router.put('/:id', authMiddleware, validate(updateJDSchema), updateJD);
router.delete('/:id', authMiddleware, deleteJD);
router.get('/', getJDs);
router.get('/:id', getJD);

export default router;
