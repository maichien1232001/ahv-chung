import { NotFoundException } from '../utils/ErrorHandler';
import { ICVCreate, ICVFilter, ICVUpdateStatus } from '../interfaces/CV.interface';
import { CV } from '../models/CV.model';
import logger from '../utils/logger';
import { CV_STATUS } from '../constants/enum.status';
import { JobDescription } from '../models/JobDescription.model';

class CVService {
    // Tạo CV mới
    async createCV(payload: ICVCreate) {
        logger.info('[CVService.createCV] Attempt', { payload });

        try {
            const { jobDescriptionId, filePath } = payload;

            const jd = await JobDescription.findById(jobDescriptionId);
            if (!jd) {
                logger.warn('[CVService.createCV] JD not found', { jobDescriptionId });
                throw new NotFoundException('Mô tả công việc');
            }

            const newCV = new CV({ filePath, jobDescriptionId });
            const savedCV = await newCV.save();

            logger.info('[CVService.createCV] Success', { cvId: savedCV._id, jobDescriptionId });
            return savedCV;
        } catch (error) {
            logger.error('[CVService.createCV] Error', { err: error, payload });
            throw error;
        }
    }

    // Lấy CV theo ID
    async getCV(id: string) {
        logger.info('[CVService.getCV] Attempt', { cvId: id });

        try {
            const cv = await CV.findById(id);

            if (!cv) {
                logger.warn('[CVService.getCV] Not found', { cvId: id });
                throw new NotFoundException('CV');
            }

            return cv;
        } catch (error) {
            logger.error('[CVService.getCV] Error', { err: error, cvId: id });
            throw error;
        }
    }

    // Lấy danh sách CV
    async getCVs(payload: ICVFilter) {
        logger.info('[CVService.getCVs] Payload', { payload });

        try {
            const { page = 1, limit = 10, jobDescriptionId } = payload;
            const skip = (page - 1) * limit;

            const query: Record<string, unknown> = {};
            if (typeof jobDescriptionId === 'string' && jobDescriptionId.trim()) {
                query.jobDescriptionId = jobDescriptionId.trim();
            }

            const [cvs, total] = await Promise.all([
                CV.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
                CV.countDocuments(query),
            ]);

            logger.info('[CVService.getCVs] Fetched CVs', { count: cvs.length });

            return {
                data: cvs,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[CVService.getCVs] Error', { err: error, payload });
            throw error;
        }
    }

    // Cập nhật trạng thái CV
    async updateStatusCV(payload: ICVUpdateStatus, id: string) {
        logger.info('[CVService.updateStatusCV] Attempt', { cvId: id, payload });

        try {
            const cv = await CV.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!cv) {
                logger.warn('[CVService.updateStatusCV] CV not found', { cvId: id });
                throw new NotFoundException('CV');
            }

            logger.info('[CVService.updateStatusCV] Success', { cvId: cv._id });
            return cv;
        } catch (error) {
            logger.error('[CVService.updateStatusCV] Error', { err: error, cvId: id, payload });
            throw error;
        }
    }

    async countStatusCV() {
        try {
            const stats = await CV.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                    },
                },
            ]);
            const result = Object.values(CV_STATUS).reduce(
                (acc, status) => {
                    acc[status] = stats.find((s) => s._id === status)?.count || 0;
                    return acc;
                },
                {} as Record<CV_STATUS, number>,
            );
            return result;
        } catch (error) {
            logger.error('[CVService.countStatusCV] Error', { err: error });
            throw error;
        }
    }
}

export default new CVService();
