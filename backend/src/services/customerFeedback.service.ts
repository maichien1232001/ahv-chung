import { ICustomerFeedback, ICustomerFeedbackFilter } from '../interfaces/CustomerFeedback.interface';
import { CustomerFeedback } from '../models/CustomerFeedback.model';
import logger from '../utils/logger';
import { DupplicateException, NotFoundException } from '../utils/ErrorHandler';

class CustomerFeedbackService {
    // Lấy feedback theo ID
    async getCustomerFeedbackById(id: string) {
        logger.info('[CustomerFeedbackService.getCustomerFeedbackById] Attempt', { id });

        try {
            const feedback = await CustomerFeedback.findById(id);

            if (!feedback) {
                logger.warn('[CustomerFeedbackService.getCustomerFeedbackById] Not found', { id });
                throw new NotFoundException('Phản hồi khách hàng');
            }

            return feedback;
        } catch (error) {
            logger.error('[CustomerFeedbackService.getCustomerFeedbackById] Error', { err: error, id });
            throw error;
        }
    }

    // Lấy danh sách feedback
    async getCustomerFeedbacks(payload: ICustomerFeedbackFilter) {
        logger.info('[CustomerFeedbackService.getCustomerFeedbacks] Payload', { payload });

        try {
            const { page = 1, limit = 10, customerName, status } = payload;
            const skip = (page - 1) * limit;

            const query: Record<string, unknown> = {};

            if (typeof customerName === 'string' && customerName.trim()) {
                query.customerName = { $regex: customerName.trim(), $options: 'i' };
            }

            if (typeof status === 'string' && status.trim()) {
                query.status = status.trim();
            }

            const [feedbacks, total] = await Promise.all([
                CustomerFeedback.find(query).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(limit).lean(),
                CustomerFeedback.countDocuments(query),
            ]);

            logger.info('[CustomerFeedbackService.getCustomerFeedbacks] Fetched feedbacks', {
                count: feedbacks.length,
            });

            return {
                data: feedbacks,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[CustomerFeedbackService.getCustomerFeedbacks] Error', { err: error });
            throw error;
        }
    }

    // Tạo feedback mới
    async createCustomerFeedback(payload: ICustomerFeedback) {
        logger.info('[CustomerFeedbackService.createCustomerFeedback] Attempt', { payload });

        try {
            const { customerName, content } = payload;

            const newFeedback = new CustomerFeedback(payload);
            const savedFeedback = await newFeedback.save();

            logger.info('[CustomerFeedbackService.createCustomerFeedback] Success', {
                id: savedFeedback._id,
                customerName,
                content,
            });

            return savedFeedback;
        } catch (error) {
            logger.error('[CustomerFeedbackService.createCustomerFeedback] Error', { err: error, payload });
            throw error;
        }
    }

    // Cập nhật feedback
    async updateCustomerFeedback(id: string, payload: Partial<ICustomerFeedback>) {
        logger.info('[CustomerFeedbackService.updateCustomerFeedback] Attempt', { id, payload });

        try {
            const feedback = await CustomerFeedback.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!feedback) {
                logger.warn('[CustomerFeedbackService.updateCustomerFeedback] Not found', { id });
                throw new NotFoundException('Phản hồi khách hàng');
            }

            logger.info('[CustomerFeedbackService.updateCustomerFeedback] Success', { id });
            return feedback;
        } catch (error) {
            logger.error('[CustomerFeedbackService.updateCustomerFeedback] Error', { err: error, id, payload });
            throw error;
        }
    }

    // Xoá feedback
    async deleteCustomerFeedback(id: string) {
        logger.info('[CustomerFeedbackService.deleteCustomerFeedback] Attempt', { id });

        try {
            const feedback = await CustomerFeedback.findByIdAndDelete(id);

            if (!feedback) {
                logger.warn('[CustomerFeedbackService.deleteCustomerFeedback] Not found', { id });
                throw new NotFoundException('Phản hồi khách hàng');
            }

            logger.info('[CustomerFeedbackService.deleteCustomerFeedback] Success', { id });
            return feedback;
        } catch (error) {
            logger.error('[CustomerFeedbackService.deleteCustomerFeedback] Error', { err: error, id });
            throw error;
        }
    }
}

export default new CustomerFeedbackService();

