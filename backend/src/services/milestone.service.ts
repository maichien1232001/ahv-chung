import { IMilestone, IMilestoneFilter } from '../interfaces/Milestone.interface';
import { Milestone } from '../models/Milestone.model';
import logger from '../utils/logger';
import { DupplicateException, NotFoundException } from '../utils/ErrorHandler';

class MilestoneService {
    // Lấy cột mốc theo ID
    async getMilestoneById(id: string) {
        logger.info('[MilestoneService.getMilestoneById] Attempt', { id });

        try {
            const milestone = await Milestone.findById(id);

            if (!milestone) {
                logger.warn('[MilestoneService.getMilestoneById] Not found', { id });
                throw new NotFoundException('Cột mốc');
            }

            return milestone;
        } catch (error) {
            logger.error('[MilestoneService.getMilestoneById] Error', { err: error, id });
            throw error;
        }
    }

    // Lấy danh sách cột mốc
    async getMilestones(payload: IMilestoneFilter) {
        logger.info('[MilestoneService.getMilestones] Payload', { payload });

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

            const [milestones, total] = await Promise.all([
                Milestone.find(query).sort({ date: 1, order: 1, updatedAt: -1 }).skip(skip).limit(limit).lean(),
                Milestone.countDocuments(query),
            ]);

            logger.info('[MilestoneService.getMilestones] Fetched milestones', { count: milestones.length });

            return {
                data: milestones,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[MilestoneService.getMilestones] Error', { err: error });
            throw error;
        }
    }

    // Tạo cột mốc mới
    async createMilestone(payload: IMilestone) {
        logger.info('[MilestoneService.createMilestone] Attempt', { payload });

        try {
            const { title, date } = payload;
            const existed = await Milestone.findOne({ title, date });

            if (existed) {
                logger.warn('[MilestoneService.createMilestone] Duplicate milestone', { title, date });
                throw new DupplicateException('Cột mốc');
            }

            const newMilestone = new Milestone(payload);
            const savedMilestone = await newMilestone.save();

            logger.info('[MilestoneService.createMilestone] Success', {
                id: savedMilestone._id,
                title,
                date,
            });

            return savedMilestone;
        } catch (error) {
            logger.error('[MilestoneService.createMilestone] Error', { err: error, payload });
            throw error;
        }
    }

    // Cập nhật cột mốc
    async updateMilestone(id: string, payload: Partial<IMilestone>) {
        logger.info('[MilestoneService.updateMilestone] Attempt', { id, payload });

        try {
            if (payload.title || payload.date) {
                const existed = await Milestone.findOne({
                    title: payload.title,
                    date: payload.date,
                } as { title: string; date: number });

                if (existed && existed._id.toString() !== id) {
                    logger.warn('[MilestoneService.updateMilestone] Duplicate milestone', {
                        id,
                        title: payload.title,
                        date: payload.date,
                    });
                    throw new DupplicateException('Cột mốc');
                }
            }

            const milestone = await Milestone.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!milestone) {
                logger.warn('[MilestoneService.updateMilestone] Not found', { id });
                throw new NotFoundException('Cột mốc');
            }

            logger.info('[MilestoneService.updateMilestone] Success', { id });
            return milestone;
        } catch (error) {
            logger.error('[MilestoneService.updateMilestone] Error', { err: error, id, payload });
            throw error;
        }
    }

    // Xoá cột mốc
    async deleteMilestone(id: string) {
        logger.info('[MilestoneService.deleteMilestone] Attempt', { id });

        try {
            const milestone = await Milestone.findByIdAndDelete(id);

            if (!milestone) {
                logger.warn('[MilestoneService.deleteMilestone] Not found', { id });
                throw new NotFoundException('Cột mốc');
            }

            logger.info('[MilestoneService.deleteMilestone] Success', { id });
            return milestone;
        } catch (error) {
            logger.error('[MilestoneService.deleteMilestone] Error', { err: error, id });
            throw error;
        }
    }
}

export default new MilestoneService();

