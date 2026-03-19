import { Router } from 'express';
import { createTicket, getTicket, getTickets, updateTicket } from '../controllers/ticket.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTicketSchema, updateTicketSchema } from '../validations/ticket.validation';

const router = Router();

router.post('/', validate(createTicketSchema), createTicket);
router.get('/', authMiddleware, getTickets);
router.get('/:id', authMiddleware, getTicket);
router.put('/:id', authMiddleware, validate(updateTicketSchema), updateTicket);

export default router;
