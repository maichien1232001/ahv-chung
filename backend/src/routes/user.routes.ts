import { Router } from 'express';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';

const router = Router();

router.get('/:id', authMiddleware, getUser);
router.get('/', authMiddleware, getUsers);
router.post('/', authMiddleware, validate(createUserSchema), createUser);
router.put('/:id', authMiddleware, validate(updateUserSchema), updateUser);
router.delete('/:id', authMiddleware, deleteUser);

export default router;
