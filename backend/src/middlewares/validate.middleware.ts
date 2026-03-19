import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validate = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Trả về tất cả các lỗi thay vì dừng lại ở lỗi đầu tiên
            stripUnknown: true, // Loại bỏ các field không có trong schema
        });

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            res.status(400).json({
                message: errorMessage,
            });
        } else {
            req.body = value; // Gán lại value đã qua xử lý (stripUnknown)
            next();
        }
    };
};
