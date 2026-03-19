import { Response, Request } from 'express';
import { errorHandler } from '../middlewares/error.middleware';
import cvService from '../services/cv.service';
import { Message } from '../constants/messages.contant';

// Tạo CV
export const createCV = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await cvService.createCV(payload);
        return res.status(201).json({
            message: 'CV ' + Message.Messages.CREATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Lấy chi tiết CV
export const getCV = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cv = await cvService.getCV(id as string);
        return res.status(200).json({
            message: 'CV ' + Message.Messages.FOUND,
            data: cv,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Lấy danh sách CV
export const getCVs = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
            jobDescriptionId: req.query.jobDescriptionId as string,
        };
        const cvs = await cvService.getCVs(payload);
        return res.status(200).json({
            message: 'Danh sách CV ' + Message.Messages.FOUND,
            data: cvs,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Cập nhật trạng thái CV
export const updateStatusCV = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const { id } = req.params;
        await cvService.updateStatusCV(payload, id as string);
        return res.status(200).json({
            message: 'Trạng thái CV ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

export const countStatusCV = async (req: Request, res: Response) => {
    try {
        const counts = await cvService.countStatusCV();
        return res.status(200).json({
            message: 'Thống kê trạng thái CV ' + Message.Messages.FOUND,
            data: counts,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};
