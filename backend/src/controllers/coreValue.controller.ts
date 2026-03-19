import { Request, Response } from 'express';
import { Message } from '../constants/messages.contant';
import coreValueService from '../services/coreValue.service';
import { errorHandler } from '../middlewares/error.middleware';

// Create Core Value
export const createCoreValue = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await coreValueService.createCoreValue(payload);
        return res.status(201).json({
            message: 'Giá trị cốt lõi ' + Message.Messages.CREATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Core Value by id
export const getCoreValue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const coreValue = await coreValueService.getCoreValueById(id as string);
        return res.status(200).json({
            message: 'Giá trị cốt lõi ' + Message.Messages.FOUND,
            data: coreValue,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Core Value list
export const getCoreValues = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            title: req.query.title as string,
            status: req.query.status as string,
        };
        const coreValues = await coreValueService.getCoreValues(payload);
        return res.status(200).json({
            message: 'Danh sách giá trị cốt lõi ' + Message.Messages.FOUND,
            data: coreValues,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Update Core Value
export const updateCoreValue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await coreValueService.updateCoreValue(id as string, payload);
        return res.status(200).json({
            message: 'Giá trị cốt lõi ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Delete Core Value
export const deleteCoreValue = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await coreValueService.deleteCoreValue(id as string);
        return res.status(200).json({
            message: 'Giá trị cốt lõi ' + Message.Messages.DELETED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

