import { NotFoundException } from '../utils/ErrorHandler';
import { ITicketFilter } from '../interfaces/Ticket.interface';
import { ITicketCreate, ITicketUpdateStatus } from '../interfaces/Ticket.interface';
import { Ticket } from '../models/Ticket.model';
import logger from '../utils/logger';

class TicketService {
    // Tạo ticket mới
    async createTicket(payload: ITicketCreate) {
        logger.info('[TicketService.createTicket] Attempt', { payload });

        try {
            const { fullname, phone, email, description } = payload;

            const newTicket = new Ticket({
                fullname,
                phone,
                email,
                description,
            });

            const savedTicket = await newTicket.save();
            logger.info('[TicketService.createTicket] Success', { ticketId: savedTicket._id });

            return savedTicket;
        } catch (error) {
            logger.error('[TicketService.createTicket] Error', { err: error });
            throw error;
        }
    }

    // Lấy danh sách ticket
    async getTickets(payload: ITicketFilter) {
        logger.info('[TicketService.getTickets] Payload', { payload });

        try {
            const { page = 1, limit = 10, status } = payload;
            const skip = (page - 1) * limit;

            const query: Record<string, unknown> = {};

            if (typeof status === 'string' && status.trim()) {
                query.status = status.trim();
            }

            const [tickets, total] = await Promise.all([
                Ticket.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
                Ticket.countDocuments(query),
            ]);

            logger.info('[TicketService.getTickets] Fetched tickets', { count: tickets.length });

            return {
                data: tickets,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[TicketService.getTickets] Error', { err: error });
            throw error;
        }
    }

    // Lấy ticket theo ID
    async getTicket(id: string) {
        logger.info('[TicketService.getTicket] Ticket ID', { ticketId: id });

        try {
            const ticket = await Ticket.findById(id);

            if (!ticket) {
                logger.warn('[TicketService.getTicket] Not found', { ticketId: id });
                throw new NotFoundException('Yêu cầu hỗ trợ');
            }

            return ticket;
        } catch (error) {
            logger.error('[TicketService.getTicket] Error', { err: error, ticketId: id });
            throw error;
        }
    }

    // Cập nhật trạng thái ticket
    async updateTicket(payload: ITicketUpdateStatus, id: string) {
        logger.info('[TicketService.updateTicket] Attempt', { ticketId: id, payload });

        try {
            const ticket = await Ticket.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!ticket) {
                logger.warn('[TicketService.updateTicket] Ticket not found', { ticketId: id });
                throw new NotFoundException('Yêu cầu hỗ trợ');
            }

            logger.info('[TicketService.updateTicket] Success', { ticketId: ticket._id });
            return ticket;
        } catch (error) {
            logger.error('[TicketService.updateTicket] Error', { err: error, ticketId: id });
            throw error;
        }
    }
}

export default new TicketService();
