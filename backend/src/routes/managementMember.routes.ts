import { Router } from 'express';
import {
    createManagementMember,
    deleteManagementMember,
    getManagementMember,
    getManagementMembers,
    updateManagementMember,
} from '../controllers/managementMember.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
    createManagementMemberSchema,
    updateManagementMemberSchema,
} from '../validations/managementMember.validation';

const router = Router();

router.get('/:id', getManagementMember);
router.get('/', getManagementMembers);
router.post('/', authMiddleware, validate(createManagementMemberSchema), createManagementMember);
router.put('/:id', authMiddleware, validate(updateManagementMemberSchema), updateManagementMember);
router.delete('/:id', authMiddleware, deleteManagementMember);

export default router;

