import { Router } from 'express';
import {
    createFeaturedProject,
    deleteFeaturedProject,
    getFeaturedProject,
    getFeaturedProjects,
    updateFeaturedProject,
} from '../controllers/featuredProject.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    createFeaturedProjectSchema,
    updateFeaturedProjectSchema,
} from '../validations/featuredProject.validation';

const router = Router();

router.get('/:id', getFeaturedProject);
router.get('/', getFeaturedProjects);
router.post('/', authMiddleware, validate(createFeaturedProjectSchema), createFeaturedProject);
router.put('/:id', authMiddleware, validate(updateFeaturedProjectSchema), updateFeaturedProject);
router.delete('/:id', authMiddleware, deleteFeaturedProject);

export default router;

