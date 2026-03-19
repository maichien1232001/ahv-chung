import Joi from 'joi';
import { ICustomerFeedback } from '../interfaces/CustomerFeedback.interface';
import { USER_STATUS } from '../constants/enum.status';

export const createCustomerFeedbackSchema = Joi.object<ICustomerFeedback>({
    customerName: Joi.string().trim().min(2).required().messages({
        'string.base': 'Tên khách hàng phải là chuỗi',
        'string.min': 'Tên khách hàng phải có ít nhất 2 ký tự',
        'string.empty': 'Tên khách hàng không được để trống',
        'any.required': 'Vui lòng nhập tên khách hàng',
    }),
    content: Joi.string().trim().min(5).required().messages({
        'string.base': 'Nội dung phải là chuỗi',
        'string.min': 'Nội dung phải có ít nhất 5 ký tự',
        'string.empty': 'Nội dung không được để trống',
        'any.required': 'Vui lòng nhập nội dung phản hồi',
    }),
    position: Joi.string().trim().allow('', null).messages({
        'string.base': 'Chức vụ phải là chuỗi',
    }),
    company: Joi.string().trim().allow('', null).messages({
        'string.base': 'Công ty phải là chuỗi',
    }),
    avatarUrl: Joi.string().uri().allow('', null).messages({
        'string.base': 'Avatar phải là chuỗi',
        'string.uri': 'Avatar phải là một URL hợp lệ',
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

export const updateCustomerFeedbackSchema = Joi.object<ICustomerFeedback>({
    customerName: Joi.string().trim().min(2).messages({
        'string.base': 'Tên khách hàng phải là chuỗi',
        'string.min': 'Tên khách hàng phải có ít nhất 2 ký tự',
        'string.empty': 'Tên khách hàng không được để trống',
    }),
    content: Joi.string().trim().min(5).messages({
        'string.base': 'Nội dung phải là chuỗi',
        'string.min': 'Nội dung phải có ít nhất 5 ký tự',
        'string.empty': 'Nội dung không được để trống',
    }),
    position: Joi.string().trim().allow('', null).messages({
        'string.base': 'Chức vụ phải là chuỗi',
    }),
    company: Joi.string().trim().allow('', null).messages({
        'string.base': 'Công ty phải là chuỗi',
    }),
    avatarUrl: Joi.string().uri().allow('', null).messages({
        'string.base': 'Avatar phải là chuỗi',
        'string.uri': 'Avatar phải là một URL hợp lệ',
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

