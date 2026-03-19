import { Request, Response } from 'express';
import { Message } from '../constants/messages.contant';
import customerFeedbackService from '../services/customerFeedback.service';
import { errorHandler } from '../middlewares/error.middleware';

// Create Customer Feedback
export const createCustomerFeedback = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await customerFeedbackService.createCustomerFeedback(payload);
        return res.status(201).json({
            message: 'Phản hồi khách hàng ' + Message.Messages.CREATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Customer Feedback by id
export const getCustomerFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const feedback = await customerFeedbackService.getCustomerFeedbackById(id as string);
        return res.status(200).json({
            message: 'Phản hồi khách hàng ' + Message.Messages.FOUND,
            data: feedback,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Customer Feedback list
export const getCustomerFeedbacks = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            customerName: req.query.customerName as string,
            status: req.query.status as string,
        };
        const feedbacks = await customerFeedbackService.getCustomerFeedbacks(payload);
        return res.status(200).json({
            message: 'Danh sách phản hồi khách hàng ' + Message.Messages.FOUND,
            data: feedbacks,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Update Customer Feedback
export const updateCustomerFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await customerFeedbackService.updateCustomerFeedback(id as string, payload);
        return res.status(200).json({
            message: 'Phản hồi khách hàng ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Delete Customer Feedback
export const deleteCustomerFeedback = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await customerFeedbackService.deleteCustomerFeedback(id as string);
        return res.status(200).json({
            message: 'Phản hồi khách hàng ' + Message.Messages.DELETED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

