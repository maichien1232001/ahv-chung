import { IOperatingField, IOperatingFieldFilter } from '../interfaces/OperatingField.interface';
import { OperatingField } from '../models/OperatingField.model';
import logger from '../utils/logger';
import { DupplicateException, NotFoundException } from '../utils/ErrorHandler';

class OperatingFieldService {
    // Lấy lĩnh vực hoạt động theo ID
    async getOperatingFieldById(id: string) {
        logger.info('[OperatingFieldService.getOperatingFieldById] Attempt', { id });

        try {
            const operatingField = await OperatingField.findById(id);

            if (!operatingField) {
                logger.warn('[OperatingFieldService.getOperatingFieldById] Not found', { id });
                throw new NotFoundException('Lĩnh vực hoạt động');
            }

            return operatingField;
        } catch (error) {
            logger.error('[OperatingFieldService.getOperatingFieldById] Error', { err: error, id });
            throw error;
        }
    }

    // Lấy danh sách lĩnh vực hoạt động
    async getOperatingFields(payload: IOperatingFieldFilter) {
        logger.info('[OperatingFieldService.getOperatingFields] Payload', { payload });

        try {
            const { page = 1, limit = 10, name, status } = payload;
            const skip = (page - 1) * limit;

            const query: Record<string, unknown> = {};

            if (typeof name === 'string' && name.trim()) {
                query.name = { $regex: name.trim(), $options: 'i' };
            }

            if (typeof status === 'string' && status.trim()) {
                query.status = status.trim();
            }

            const [operatingFields, total] = await Promise.all([
                OperatingField.find(query).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(limit).lean(),
                OperatingField.countDocuments(query),
            ]);

            logger.info('[OperatingFieldService.getOperatingFields] Fetched operating fields', {
                count: operatingFields.length,
            });

            return {
                data: operatingFields,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[OperatingFieldService.getOperatingFields] Error', { err: error });
            throw error;
        }
    }

    // Tạo lĩnh vực hoạt động mới
    async createOperatingField(payload: IOperatingField) {
        logger.info('[OperatingFieldService.createOperatingField] Attempt', { payload });

        try {
            const { name } = payload;
            const existed = await OperatingField.findOne({ name });

            if (existed) {
                logger.warn('[OperatingFieldService.createOperatingField] Duplicate operating field', { name });
                throw new DupplicateException('Lĩnh vực hoạt động');
            }

            const newOperatingField = new OperatingField(payload);
            const savedOperatingField = await newOperatingField.save();

            logger.info('[OperatingFieldService.createOperatingField] Success', {
                id: savedOperatingField._id,
                name,
            });

            return savedOperatingField;
        } catch (error) {
            logger.error('[OperatingFieldService.createOperatingField] Error', { err: error, payload });
            throw error;
        }
    }

    // Cập nhật lĩnh vực hoạt động
    async updateOperatingField(id: string, payload: Partial<IOperatingField>) {
        logger.info('[OperatingFieldService.updateOperatingField] Attempt', { id, payload });

        try {
            if (payload.name) {
                const existed = await OperatingField.findOne({ name: payload.name });
                if (existed && existed._id.toString() !== id) {
                    logger.warn('[OperatingFieldService.updateOperatingField] Duplicate operating field', {
                        id,
                        name: payload.name,
                    });
                    throw new DupplicateException('Lĩnh vực hoạt động');
                }
            }

            const operatingField = await OperatingField.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!operatingField) {
                logger.warn('[OperatingFieldService.updateOperatingField] Not found', { id });
                throw new NotFoundException('Lĩnh vực hoạt động');
            }

            logger.info('[OperatingFieldService.updateOperatingField] Success', { id });
            return operatingField;
        } catch (error) {
            logger.error('[OperatingFieldService.updateOperatingField] Error', { err: error, id, payload });
            throw error;
        }
    }

    // Xoá lĩnh vực hoạt động
    async deleteOperatingField(id: string) {
        logger.info('[OperatingFieldService.deleteOperatingField] Attempt', { id });

        try {
            const operatingField = await OperatingField.findByIdAndDelete(id);

            if (!operatingField) {
                logger.warn('[OperatingFieldService.deleteOperatingField] Not found', { id });
                throw new NotFoundException('Lĩnh vực hoạt động');
            }

            logger.info('[OperatingFieldService.deleteOperatingField] Success', { id });
            return operatingField;
        } catch (error) {
            logger.error('[OperatingFieldService.deleteOperatingField] Error', { err: error, id });
            throw error;
        }
    }
}

export default new OperatingFieldService();

