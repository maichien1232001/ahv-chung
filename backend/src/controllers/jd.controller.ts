import { Response, Request } from 'express';
import { errorHandler } from '../middlewares/error.middleware';
import jdService from '../services/jd.service';
import { Message } from '../constants/messages.contant';

// Tạo mô tả công việc
export const createJD = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await jdService.createJD(payload);
        return res.status(201).json({
            message: 'Mô tả công việc ' + Message.Messages.CREATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Cập nhật mô tả công việc
export const updateJD = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await jdService.updateJD(payload, id as string);
        return res.status(200).json({
            message: 'Mô tả công việc ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Xoá mô tả công việc
export const deleteJD = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await jdService.deleteJD(id as string);
        return res.status(200).json({
            message: 'Mô tả công việc ' + Message.Messages.DELETED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Lấy chi tiết mô tả công việc
export const getJD = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const jd = await jdService.getJD(id as string);
        return res.status(200).json({
            message: 'Mô tả công việc ' + Message.Messages.FOUND,
            data: jd,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};

// Lấy danh sách mô tả công việc
export const getJDs = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
            title: req.query.title as string,
            location: req.query.location as string,
        };
        const jds = await jdService.getJDs(payload);
        return res.status(200).json({
            message: 'Danh sách mô tả công việc ' + Message.Messages.FOUND,
            data: jds,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({ message: result });
        }
        return res.status(result.status).json({ message: result.message });
    }
};
