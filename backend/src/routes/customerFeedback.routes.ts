import { Router } from 'express';
import {
    createCustomerFeedback,
    deleteCustomerFeedback,
    getCustomerFeedback,
    getCustomerFeedbacks,
    updateCustomerFeedback,
} from '../controllers/customerFeedback.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    createCustomerFeedbackSchema,
    updateCustomerFeedbackSchema,
} from '../validations/customerFeedback.validation';

const router = Router();

router.get('/:id', getCustomerFeedback);
router.get('/', getCustomerFeedbacks);
router.post('/', authMiddleware, validate(createCustomerFeedbackSchema), createCustomerFeedback);
router.put('/:id', authMiddleware, validate(updateCustomerFeedbackSchema), updateCustomerFeedback);
router.delete('/:id', authMiddleware, deleteCustomerFeedback);

export default router;

