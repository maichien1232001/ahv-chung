import Joi from 'joi';
import { IOperatingField } from '../interfaces/OperatingField.interface';
import { USER_STATUS } from '../constants/enum.status';

export const createOperatingFieldSchema = Joi.object<IOperatingField>({
    name: Joi.string().trim().min(3).required().messages({
        'string.base': 'Tên phải là chuỗi',
        'string.min': 'Tên phải có ít nhất 3 ký tự',
        'string.empty': 'Tên không được để trống',
        'any.required': 'Vui lòng nhập tên lĩnh vực hoạt động',
    }),
    description: Joi.string().trim().min(5).required().messages({
        'string.base': 'Mô tả phải là chuỗi',
        'string.min': 'Mô tả phải có ít nhất 5 ký tự',
        'string.empty': 'Mô tả không được để trống',
        'any.required': 'Vui lòng nhập mô tả lĩnh vực hoạt động',
    }),
    icon: Joi.string().uri().allow('', null).messages({
        'string.base': 'Icon phải là chuỗi',
        'string.uri': 'Icon phải là một URL hợp lệ',
    }),
    order: Joi.number().integer().min(0).messages({
        'number.base': 'Thứ tự phải là số',
        'number.integer': 'Thứ tự phải là số nguyên',
        'number.min': 'Thứ tự phải lớn hơn hoặc bằng 0',
    }),
    status: Joi.string()
        .valid(...Object.values(USER_STATUS))
        .messages({
            'string.base': 'Trạng thái phải là chuỗi',
            'any.only': `Trạng thái phải là một trong các giá trị: ${Object.values(USER_STATUS).join(', ')}`,
        }),
});

export const updateOperatingFieldSchema = Joi.object<IOperatingField>({
    name: Joi.string().trim().min(3).messages({
        'string.base': 'Tên phải là chuỗi',
        'string.min': 'Tên phải có ít nhất 3 ký tự',
        'string.empty': 'Tên không được để trống',
    }),
    description: Joi.string().trim().min(5).messages({
        'string.base': 'Mô tả phải là chuỗi',
        'string.min': 'Mô tả phải có ít nhất 5 ký tự',
        'string.empty': 'Mô tả không được để trống',
    }),
    icon: Joi.string().uri().allow('', null).messages({
        'string.base': 'Icon phải là chuỗi',
        'string.uri': 'Icon phải là một URL hợp lệ',
    }),
    order: Joi.number().integer().min(0).messages({
        'number.base': 'Thứ tự phải là số',
        'number.integer': 'Thứ tự phải là số nguyên',
        'number.min': 'Thứ tự phải lớn hơn hoặc bằng 0',
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

