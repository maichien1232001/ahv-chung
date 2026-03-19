import { Request, Response } from 'express';
import { Message } from '../constants/messages.contant';
import operatingFieldService from '../services/operatingField.service';
import { errorHandler } from '../middlewares/error.middleware';

// Create Operating Field
export const createOperatingField = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await operatingFieldService.createOperatingField(payload);
        return res.status(201).json({
            message: 'Lĩnh vực hoạt động ' + Message.Messages.CREATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Operating Field by id
export const getOperatingField = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const operatingField = await operatingFieldService.getOperatingFieldById(id as string);
        return res.status(200).json({
            message: 'Lĩnh vực hoạt động ' + Message.Messages.FOUND,
            data: operatingField,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Get Operating Field list
export const getOperatingFields = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: parseInt(req.query.page as string) || 1,
            limit: parseInt(req.query.limit as string) || 10,
            name: req.query.name as string,
            status: req.query.status as string,
        };
        const operatingFields = await operatingFieldService.getOperatingFields(payload);
        return res.status(200).json({
            message: 'Danh sách lĩnh vực hoạt động ' + Message.Messages.FOUND,
            data: operatingFields,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Update Operating Field
export const updateOperatingField = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await operatingFieldService.updateOperatingField(id as string, payload);
        return res.status(200).json({
            message: 'Lĩnh vực hoạt động ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Delete Operating Field
export const deleteOperatingField = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await operatingFieldService.deleteOperatingField(id as string);
        return res.status(200).json({
            message: 'Lĩnh vực hoạt động ' + Message.Messages.DELETED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

