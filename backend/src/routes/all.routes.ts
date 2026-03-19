import Router from 'express';

import userRoutes from './user.routes';
import postRoutes from './post.routes';
import categoryRoutes from './category.routes';
import authRoutes from './auth.routes';
import ticketRoutes from './ticket.routes';
import jdRoutes from './jd.routes';
import cvRoutes from './cv.routes';
import managementMemberRoutes from './managementMember.routes';
import coreValueRoutes from './coreValue.routes';
import milestoneRoutes from './milestone.routes';
import operatingFieldRoutes from './operatingField.routes';
import customerFeedbackRoutes from './customerFeedback.routes';
import featuredProjectRoutes from './featuredProject.routes';
const router = Router();

router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/categories', categoryRoutes);
router.use('/auths', authRoutes);
router.use('/tickets', ticketRoutes);
router.use('/jds', jdRoutes);
router.use('/cvs', cvRoutes);
router.use('/management-members', managementMemberRoutes);
router.use('/core-values', coreValueRoutes);
router.use('/milestones', milestoneRoutes);
router.use('/operating-fields', operatingFieldRoutes);
router.use('/customer-feedbacks', customerFeedbackRoutes);
router.use('/featured-projects', featuredProjectRoutes);

export const allRoutes = router;
