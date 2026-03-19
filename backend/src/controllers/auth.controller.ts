import { Request, Response } from 'express';
import authenService from '../services/auth.service';
import { Message } from '../constants/messages.contant';
import { errorHandler } from '../middlewares/error.middleware';

export const login = async (req: Request, res: Response) => {
    try {
        const payload = req.body;
        const result = await authenService.login(payload);
        const { refreshToken, ...safeResult } = result;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: Message.Messages.LOGINED,
            data: safeResult,
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

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const result = await authenService.refreshToken(refreshToken);
        const { newAccessToken, newRefreshToken } = result;
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: Message.Messages.REFRESHED_TOKEN,
            data: newAccessToken,
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

export const getMe = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        const user = await authenService.getMe(authHeader as string);
        return res.status(200).json({
            message: Message.Messages.FOUND,
            data: user,
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
