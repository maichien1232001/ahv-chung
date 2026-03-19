import { Router } from 'express';
import {
    createCategory,
    deleteCategory,
    getCategories,
    getCategory,
    updateCategory,
} from '../controllers/category.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCategorySchema, updateCategorySchema } from '../validations/category.validation';

const router = Router();

router.post('/', validate(createCategorySchema), authMiddleware, createCategory);
router.get('/:id', getCategory);
router.get('/', getCategories);
router.put('/:id', validate(updateCategorySchema), authMiddleware, updateCategory);
router.delete('/:id', authMiddleware, deleteCategory);

export default router;
