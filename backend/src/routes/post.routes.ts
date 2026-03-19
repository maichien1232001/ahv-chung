import { Router } from 'express';
import { createPost, deletePost, getPost, getPosts, updatePost } from '../controllers/post.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createPostSchema, updatePostSchema } from '../validations/post.validation';

const router = Router();

router.post('/', authMiddleware, validate(createPostSchema), createPost);
router.get('/:id', getPost);
router.get('/', getPosts);
router.put('/:id', authMiddleware, validate(updatePostSchema), updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
