import { ICoreValue, ICoreValueFilter } from '../interfaces/CoreValue.interface';
import { CoreValue } from '../models/CoreValue.model';
import logger from '../utils/logger';
import { DupplicateException, NotFoundException } from '../utils/ErrorHandler';

class CoreValueService {
    // Lấy giá trị cốt lõi theo ID
    async getCoreValueById(id: string) {
        logger.info('[CoreValueService.getCoreValueById] Attempt', { id });

        try {
            const coreValue = await CoreValue.findById(id);

            if (!coreValue) {
                logger.warn('[CoreValueService.getCoreValueById] Not found', { id });
                throw new NotFoundException('Giá trị cốt lõi');
            }

            return coreValue;
        } catch (error) {
            logger.error('[CoreValueService.getCoreValueById] Error', { err: error, id });
            throw error;
        }
    }

    // Lấy danh sách giá trị cốt lõi
    async getCoreValues(payload: ICoreValueFilter) {
        logger.info('[CoreValueService.getCoreValues] Payload', { payload });

        try {
            const { page = 1, limit = 10, title, status } = payload;
            const skip = (page - 1) * limit;

            const query: Record<string, unknown> = {};

            if (typeof title === 'string' && title.trim()) {
                query.title = { $regex: title.trim(), $options: 'i' };
            }

            if (typeof status === 'string' && status.trim()) {
                query.status = status.trim();
            }

            const [coreValues, total] = await Promise.all([
                CoreValue.find(query).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(limit).lean(),
                CoreValue.countDocuments(query),
            ]);

            logger.info('[CoreValueService.getCoreValues] Fetched core values', { count: coreValues.length });

            return {
                data: coreValues,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[CoreValueService.getCoreValues] Error', { err: error });
            throw error;
        }
    }

    // Tạo giá trị cốt lõi mới
    async createCoreValue(payload: ICoreValue) {
        logger.info('[CoreValueService.createCoreValue] Attempt', { payload });

        try {
            const { title } = payload;
            const existed = await CoreValue.findOne({ title });

            if (existed) {
                logger.warn('[CoreValueService.createCoreValue] Duplicate core value', { title });
                throw new DupplicateException('Giá trị cốt lõi');
            }

            const newCoreValue = new CoreValue(payload);
            const savedCoreValue = await newCoreValue.save();

            logger.info('[CoreValueService.createCoreValue] Success', {
                id: savedCoreValue._id,
                title,
            });

            return savedCoreValue;
        } catch (error) {
            logger.error('[CoreValueService.createCoreValue] Error', { err: error, payload });
            throw error;
        }
    }

    // Cập nhật giá trị cốt lõi
    async updateCoreValue(id: string, payload: Partial<ICoreValue>) {
        logger.info('[CoreValueService.updateCoreValue] Attempt', { id, payload });

        try {
            if (payload.title) {
                const existed = await CoreValue.findOne({ title: payload.title });
                if (existed && existed._id.toString() !== id) {
                    logger.warn('[CoreValueService.updateCoreValue] Duplicate core value', {
                        id,
                        title: payload.title,
                    });
                    throw new DupplicateException('Giá trị cốt lõi');
                }
            }

            const coreValue = await CoreValue.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!coreValue) {
                logger.warn('[CoreValueService.updateCoreValue] Not found', { id });
                throw new NotFoundException('Giá trị cốt lõi');
            }

            logger.info('[CoreValueService.updateCoreValue] Success', { id });
            return coreValue;
        } catch (error) {
            logger.error('[CoreValueService.updateCoreValue] Error', { err: error, id, payload });
            throw error;
        }
    }

    // Xoá giá trị cốt lõi
    async deleteCoreValue(id: string) {
        logger.info('[CoreValueService.deleteCoreValue] Attempt', { id });

        try {
            const coreValue = await CoreValue.findByIdAndDelete(id);

            if (!coreValue) {
                logger.warn('[CoreValueService.deleteCoreValue] Not found', { id });
                throw new NotFoundException('Giá trị cốt lõi');
            }

            logger.info('[CoreValueService.deleteCoreValue] Success', { id });
            return coreValue;
        } catch (error) {
            logger.error('[CoreValueService.deleteCoreValue] Error', { err: error, id });
            throw error;
        }
    }
}

export default new CoreValueService();

