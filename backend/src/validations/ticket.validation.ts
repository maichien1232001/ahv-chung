import Joi from 'joi';
import { ITicketCreate, ITicketUpdateStatus } from '../interfaces/Ticket.interface';
import { TICKET_STATUS } from '../constants/enum.status';

export const createTicketSchema = Joi.object<ITicketCreate>({
    fullname: Joi.string().trim().required().messages({
        'string.base': 'Họ và tên phải là chuỗi',
        'string.empty': 'Họ và tên không được để trống',
        'any.required': 'Vui lòng nhập họ và tên',
    }),

    phone: Joi.string()
        .pattern(/^(0|\+84)[3|5|7|8|9]\d{8}$/)
        .required()
        .messages({
            'string.base': 'Số điện thoại phải là chuỗi',
            'string.pattern.base': 'Số điện thoại không đúng định dạng Việt Nam',
            'string.empty': 'Số điện thoại không được để trống',
            'any.required': 'Vui lòng nhập số điện thoại',
        }),

    email: Joi.string().email().required().messages({
        'string.base': 'Email phải là chuỗi',
        'string.email': 'Email không đúng định dạng',
        'string.empty': 'Email không được để trống',
        'any.required': 'Vui lòng nhập email',
    }),

    description: Joi.string().trim().messages({
        'string.base': 'Nội dung hỗ trợ phải là chuỗi',
        'string.empty': 'Nội dung hỗ trợ không được để trống',
        'any.required': 'Vui lòng nhập nội dung hỗ trợ',
    }),
});

export const updateTicketSchema = Joi.object<ITicketUpdateStatus>({
    status: Joi.string()
        .valid(...Object.values(TICKET_STATUS))
        .required()
        .messages({
            'string.base': 'Trạng thái ticket phải là chuỗi',
            'any.only': 'Trạng thái ticket không hợp lệ',
            'any.required': 'Vui lòng cung cấp trạng thái ticket',
        }),
});
