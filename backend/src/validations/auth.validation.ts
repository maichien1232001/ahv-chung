import Joi from 'joi';
import { ILogin, IRefreshToken } from '../interfaces/Auth.interface';

export const loginSchema = Joi.object<ILogin>({
    username: Joi.string().trim().min(3).max(50).required().messages({
        'string.empty': 'Username không được để trống',
        'string.min': 'Username tối thiểu 3 ký tự',
        'any.required': 'Username là bắt buộc',
    }),

    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password không được để trống',
        'string.min': 'Password tối thiểu 6 ký tự',
        'any.required': 'Password là bắt buộc',
    }),
});

export const refreshTokenSchema = Joi.object<IRefreshToken>({
    refreshToken: Joi.string().trim().required().messages({
        'string.empty': 'Refresh token không được để trống',
        'any.required': 'Refresh token là bắt buộc',
    }),
});
