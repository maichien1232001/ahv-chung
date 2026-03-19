import Joi from 'joi';
import { IPost } from '../interfaces/Post.interface';
import { POST_STATUS } from '../constants/enum.status';

export const createPostSchema = Joi.object<IPost>({
    title: Joi.string().min(3).max(500).required().messages({
        'string.base': 'Tiêu đề phải là chuỗi',
        'string.min': 'Tiêu đề phải có ít nhất 3 ký tự',
        'string.max': 'Tiêu đề không được vượt quá 500 ký tự',
        'string.empty': 'Tiêu đề không được để trống',
        'any.required': 'Vui lòng nhập tiêu đề bài viết',
    }),

    content: Joi.string().min(10).required().messages({
        'string.base': 'Nội dung phải là chuỗi',
        'string.min': 'Nội dung phải có ít nhất 10 ký tự',
        'string.empty': 'Nội dung không được để trống',
        'any.required': 'Vui lòng nhập nội dung bài viết',
    }),

    categoryId: Joi.string().hex().length(24).required().messages({
        'string.base': 'Danh mục không hợp lệ',
        'string.hex': 'ID danh mục không đúng định dạng',
        'string.length': 'ID danh mục phải có 24 ký tự',
        'any.required': 'Vui lòng chọn danh mục bài viết',
    }),

    imageUrl: Joi.string().uri().required().messages({
        'string.base': 'Ảnh đại diện phải là chuỗi',
        'string.uri': 'Đường dẫn ảnh không hợp lệ',
        'any.required': 'Vui lòng cung cấp ảnh đại diện',
    }),

    tags: Joi.array()
        .items(
            Joi.string().trim().min(1).messages({
                'string.base': 'Tag phải là chuỗi',
                'string.min': 'Tag không được để trống',
                'string.empty': 'Tag không được để trống',
            }),
        )
        .messages({
            'array.base': 'Tags phải là mảng',
            'array.includes': 'Danh sách tag không hợp lệ',
        }),
});

export const updatePostSchema = Joi.object<IPost>({
    title: Joi.string().min(3).max(500).messages({
        'string.base': 'Tiêu đề phải là chuỗi',
        'string.min': 'Tiêu đề phải có ít nhất 3 ký tự',
        'string.max': 'Tiêu đề không được vượt quá 500 ký tự',
        'string.empty': 'Tiêu đề không được để trống',
    }),

    content: Joi.string().min(10).messages({
        'string.base': 'Nội dung phải là chuỗi',
        'string.min': 'Nội dung phải có ít nhất 10 ký tự',
        'string.empty': 'Nội dung không được để trống',
    }),

    categoryId: Joi.string().hex().length(24).messages({
        'string.base': 'Danh mục không hợp lệ',
        'string.hex': 'ID danh mục không đúng định dạng',
        'string.length': 'ID danh mục phải có 24 ký tự',
    }),

    imageUrl: Joi.string().uri().messages({
        'string.base': 'Ảnh đại diện phải là chuỗi',
        'string.uri': 'Đường dẫn ảnh không hợp lệ',
    }),

    tags: Joi.array()
        .items(
            Joi.string().trim().min(1).messages({
                'string.base': 'Tag phải là chuỗi',
                'string.min': 'Tag không được để trống',
                'string.empty': 'Tag không được để trống',
            }),
        )
        .messages({
            'array.base': 'Tags phải là mảng',
            'array.includes': 'Danh sách tag không hợp lệ',
        }),

    status: Joi.string()
        .valid(...Object.values(POST_STATUS))
        .messages({
            'string.base': 'Trạng thái phải là chuỗi',
            'any.only': 'Trạng thái CV không hợp lệ',
            'any.required': 'Vui lòng cung cấp trạng thái CV',
        }),
})
    .min(1)
    .messages({
        'object.min': 'Vui lòng cập nhật ít nhất một trường',
    });
