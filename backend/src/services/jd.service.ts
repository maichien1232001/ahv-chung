import { IJDCreate, IJDFilter, IJDUpdate } from '../interfaces/JD.interface';
import logger from '../utils/logger';
import { JobDescription } from '../models/JobDescription.model';
import { NotFoundException } from '../utils/ErrorHandler';

class JobDescriptionService {
    // Tạo JD mới
    async createJD(payload: IJDCreate) {
        logger.info('[JobDescriptionService.createJD] Attempt', { payload });

        try {
            const newJD = new JobDescription(payload);
            const savedJD = await newJD.save();

            logger.info('[JobDescriptionService.createJD] Success', { jdId: savedJD._id, title: savedJD.title });
            return savedJD;
        } catch (error) {
            logger.error('[JobDescriptionService.createJD] Error', { err: error });
            throw error;
        }
    }

    // Cập nhật JD
    async updateJD(payload: IJDUpdate, id: string) {
        logger.info('[JobDescriptionService.updateJD] Attempt', { jdId: id, payload });

        try {
            const jd = await JobDescription.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!jd) {
                logger.warn('[JobDescriptionService.updateJD] Not found', { jdId: id });
                throw new NotFoundException('Mô tả công việc');
            }

            logger.info('[JobDescriptionService.updateJD] Success', { jdId: jd._id });
            return jd;
        } catch (error) {
            logger.error('[JobDescriptionService.updateJD] Error', { err: error, jdId: id });
            throw error;
        }
    }

    // Xoá JD
    async deleteJD(id: string) {
        logger.info('[JobDescriptionService.deleteJD] Attempt', { jdId: id });

        try {
            const jd = await JobDescription.findByIdAndDelete(id);

            if (!jd) {
                logger.warn('[JobDescriptionService.deleteJD] Not found', { jdId: id });
                throw new NotFoundException('Mô tả công việc');
            }

            logger.info('[JobDescriptionService.deleteJD] Success', { jdId: jd._id });
            return jd;
        } catch (error) {
            logger.error('[JobDescriptionService.deleteJD] Error', { err: error, jdId: id });
            throw error;
        }
    }

    // Lấy JD theo ID
    async getJD(id: string) {
        logger.info('[JobDescriptionService.getJD] Attempt', { jdId: id });

        try {
            const jd = await JobDescription.findById(id);

            if (!jd) {
                logger.warn('[JobDescriptionService.getJD] Not found', { jdId: id });
                throw new NotFoundException('Mô tả công việc');
            }

            return jd;
        } catch (error) {
            logger.error('[JobDescriptionService.getJD] Error', { err: error, jdId: id });
            throw error;
        }
    }

    // Lấy danh sách JD
    async getJDs(payload: IJDFilter) {
        logger.info('[JobDescriptionService.getJDs] Payload', { payload });

        try {
            const { page = 1, limit = 10, title, location } = payload;
            const skip = (page - 1) * limit;

            const query: Record<string, unknown> = {};
            if (typeof title === 'string' && title.trim()) {
                query.title = { $regex: title, $options: 'i' };
            }

            if (typeof location === 'string' && location.trim()) {
                query.location = { $regex: location, $options: 'i' };
            }

            const [jds, total] = await Promise.all([
                JobDescription.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
                JobDescription.countDocuments(query),
            ]);

            logger.info('[JobDescriptionService.getJDs] Fetched JD', { count: jds.length });

            return {
                data: jds,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[JobDescriptionService.getJDs] Error', { err: error });
            throw error;
        }
    }
}

export default new JobDescriptionService();
