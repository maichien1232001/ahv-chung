import Joi from 'joi';
import { IUserCreate, IUserUpdate } from '../interfaces/User.interface';
import { USER_STATUS } from '../constants/enum.status';

export const createUserSchema = Joi.object<IUserCreate>({
    name: Joi.string().trim().min(3).required().messages({
        'string.base': 'Tên phải là chuỗi',
        'string.min': 'Tên phải có ít nhất 3 ký tự',
        'string.empty': 'Tên không được để trống',
        'any.required': 'Vui lòng nhập tên người dùng',
    }),

    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.base': 'Tên đăng nhập phải là chuỗi',
        'string.alphanum': 'Tên đăng nhập chỉ được chứa chữ cái và số',
        'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
        'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự',
        'string.empty': 'Tên đăng nhập không được để trống',
        'any.required': 'Vui lòng nhập tên đăng nhập',
    }),

    password: Joi.string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/)
        .required()
        .messages({
            'string.base': 'Mật khẩu phải là chuỗi',
            'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
            'string.empty': 'Mật khẩu không được để trống',
            'string.pattern.base': 'Mật khẩu phải gồm ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt',
            'any.required': 'Vui lòng nhập mật khẩu',
        }),
});

export const updateUserSchema = Joi.object<IUserUpdate>({
    name: Joi.string().trim().min(3).messages({
        'string.base': 'Tên phải là chuỗi',
        'string.min': 'Tên phải có ít nhất 3 ký tự',
        'string.empty': 'Tên không được để trống',
    }),

    username: Joi.string().alphanum().min(3).max(30).messages({
        'string.base': 'Tên đăng nhập phải là chuỗi',
        'string.alphanum': 'Tên đăng nhập chỉ được chứa chữ cái và số',
        'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
        'string.max': 'Tên đăng nhập không được vượt quá 30 ký tự',
        'string.empty': 'Tên đăng nhập không được để trống',
    }),

    status: Joi.string()
        .valid(...Object.values(USER_STATUS))
        .messages({
            'string.base': 'Trạng thái phải là chuỗi',
            'any.only': `Trạng thái phải là một trong các giá trị: ${Object.values(USER_STATUS).join(', ')}`,
        }),
})
    .min(1)
    .messages({
        'object.min': 'Vui lòng cập nhật ít nhất một trường',
    });
