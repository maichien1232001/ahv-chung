import { Router } from 'express';
import {
    createOperatingField,
    deleteOperatingField,
    getOperatingField,
    getOperatingFields,
    updateOperatingField,
} from '../controllers/operatingField.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createOperatingFieldSchema, updateOperatingFieldSchema } from '../validations/operatingField.validation';

const router = Router();

router.get('/:id', getOperatingField);
router.get('/', getOperatingFields);
router.post('/', authMiddleware, validate(createOperatingFieldSchema), createOperatingField);
router.put('/:id', authMiddleware, validate(updateOperatingFieldSchema), updateOperatingField);
router.delete('/:id', authMiddleware, deleteOperatingField);

export default router;

