import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ENV from '../constants/enviroment.constant';
import logger from '../utils/logger';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'Chưa được xác thực',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token as string, ENV.JWT_SECRET as string);

        res.locals.user = decoded;
        next();
    } catch (error: unknown) {
        logger.error('[authMiddleware] Error: ' + error);

        return res.status(401).json({
            message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ',
        });
    }
};
