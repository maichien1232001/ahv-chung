import { Router } from 'express';
import {
    createCoreValue,
    deleteCoreValue,
    getCoreValue,
    getCoreValues,
    updateCoreValue,
} from '../controllers/coreValue.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCoreValueSchema, updateCoreValueSchema } from '../validations/coreValue.validation';

const router = Router();

router.get('/:id', getCoreValue);
router.get('/', getCoreValues);
router.post('/', authMiddleware, validate(createCoreValueSchema), createCoreValue);
router.put('/:id', authMiddleware, validate(updateCoreValueSchema), updateCoreValue);
router.delete('/:id', authMiddleware, deleteCoreValue);

export default router;

