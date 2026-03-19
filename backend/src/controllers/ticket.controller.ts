import { Response, Request } from 'express';
import { errorHandler } from '../middlewares/error.middleware';
import ticketService from '../services/ticket.service';
import { Message } from '../constants/messages.contant';

export const createTicket = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await ticketService.createTicket(payload);
        return res.status(201).json({
            message: 'Yêu cầu hỗ trợ ' + Message.Messages.CREATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

export const getTickets = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
            status: req.query.status ? String(req.query.status) : '',
        };
        const tickets = await ticketService.getTickets(payload);
        return res.status(200).json({
            message: 'Danh sách yêu cầu hỗ trợ ' + Message.Messages.FOUND,
            data: tickets,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

export const getTicket = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const ticket = await ticketService.getTicket(id as string);
        return res.status(200).json({
            message: 'Yêu cầu hỗ trợ ' + Message.Messages.FOUND,
            data: ticket,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

export const updateTicket = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await ticketService.updateTicket(payload, id as string);
        return res.status(200).json({
            message: 'Trạng thái yêu cầu hỗ trợ ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};
