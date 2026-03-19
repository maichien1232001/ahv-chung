import { Router } from 'express';
import { getMe, login, refreshToken } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema } from '../validations/auth.validation';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.get('/me', authMiddleware, getMe);

export default router;
