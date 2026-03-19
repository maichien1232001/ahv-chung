import { Response, Request } from 'express';
import { Message } from '../constants/messages.contant';
import userService from '../services/user.service';
import { errorHandler } from '../middlewares/error.middleware';

// create User
export const createUser = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        await userService.createUser(payload);
        return res.status(201).json({ message: 'Người Dùng ' + Message.Messages.CREATED });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({
                message: result,
            });
        }
        return res.status(result.status).json({
            message: result.message,
        });
    }
};

// get User list
export const getUsers = async (req: Request, res: Response) => {
    try {
        const payload = {
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 10,
            status: (req.query.status as string) || '',
        };
        const users = await userService.getUsers(payload);
        return res.status(200).json({
            message: 'Danh sách Người Dùng ' + Message.Messages.FOUND,
            data: users,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({
                message: result,
            });
        }
        return res.status(result.status).json({
            message: result.message,
        });
    }
};

// get User By id
export const getUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await userService.getUser(id as string);
        return res.status(200).json({ message: 'Người Dùng ' + Message.Messages.FOUND, data: user });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({
                message: result,
            });
        }
        return res.status(result.status).json({
            message: result.message,
        });
    }
};

// update User
export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        await userService.updateUser(id as string, payload);
        return res.status(200).json({
            message: 'Người Dùng ' + Message.Messages.UPDATED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({
                message: result,
            });
        }
        return res.status(result.status).json({
            message: result.message,
        });
    }
};

// delete User
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await userService.deleteUser(id as string);
        return res.status(200).json({
            message: 'Người Dùng ' + Message.Messages.DELETED,
        });
    } catch (error: unknown) {
        const result = errorHandler(error);
        if (typeof result === 'string') {
            return res.status(500).json({
                message: result,
            });
        }
        return res.status(result.status).json({
            message: result.message,
        });
    }
};
