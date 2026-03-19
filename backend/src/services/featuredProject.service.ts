import { IFeaturedProject, IFeaturedProjectFilter } from '../interfaces/FeaturedProject.interface';
import { FeaturedProject } from '../models/FeaturedProject.model';
import logger from '../utils/logger';
import { DupplicateException, NotFoundException } from '../utils/ErrorHandler';

class FeaturedProjectService {
    // Lấy dự án tiêu biểu theo ID
    async getFeaturedProjectById(id: string) {
        logger.info('[FeaturedProjectService.getFeaturedProjectById] Attempt', { id });

        try {
            const project = await FeaturedProject.findById(id);

            if (!project) {
                logger.warn('[FeaturedProjectService.getFeaturedProjectById] Not found', { id });
                throw new NotFoundException('Dự án tiêu biểu');
            }

            return project;
        } catch (error) {
            logger.error('[FeaturedProjectService.getFeaturedProjectById] Error', { err: error, id });
            throw error;
        }
    }

    // Lấy danh sách dự án tiêu biểu
    async getFeaturedProjects(payload: IFeaturedProjectFilter) {
        logger.info('[FeaturedProjectService.getFeaturedProjects] Payload', { payload });

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

            const [projects, total] = await Promise.all([
                FeaturedProject.find(query).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(limit).lean(),
                FeaturedProject.countDocuments(query),
            ]);

            logger.info('[FeaturedProjectService.getFeaturedProjects] Fetched projects', {
                count: projects.length,
            });

            return {
                data: projects,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[FeaturedProjectService.getFeaturedProjects] Error', { err: error });
            throw error;
        }
    }

    // Tạo dự án tiêu biểu mới
    async createFeaturedProject(payload: IFeaturedProject) {
        logger.info('[FeaturedProjectService.createFeaturedProject] Attempt', { payload });

        try {
            const { name } = payload;
            const existed = await FeaturedProject.findOne({ name });

            if (existed) {
                logger.warn('[FeaturedProjectService.createFeaturedProject] Duplicate featured project', { name });
                throw new DupplicateException('Dự án tiêu biểu');
            }

            const newProject = new FeaturedProject(payload);
            const savedProject = await newProject.save();

            logger.info('[FeaturedProjectService.createFeaturedProject] Success', {
                id: savedProject._id,
                name,
            });

            return savedProject;
        } catch (error) {
            logger.error('[FeaturedProjectService.createFeaturedProject] Error', { err: error, payload });
            throw error;
        }
    }

    // Cập nhật dự án tiêu biểu
    async updateFeaturedProject(id: string, payload: Partial<IFeaturedProject>) {
        logger.info('[FeaturedProjectService.updateFeaturedProject] Attempt', { id, payload });

        try {
            if (payload.name) {
                const existed = await FeaturedProject.findOne({ name: payload.name });
                if (existed && existed._id.toString() !== id) {
                    logger.warn('[FeaturedProjectService.updateFeaturedProject] Duplicate featured project', {
                        id,
                        name: payload.name,
                    });
                    throw new DupplicateException('Dự án tiêu biểu');
                }
            }

            const project = await FeaturedProject.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!project) {
                logger.warn('[FeaturedProjectService.updateFeaturedProject] Not found', { id });
                throw new NotFoundException('Dự án tiêu biểu');
            }

            logger.info('[FeaturedProjectService.updateFeaturedProject] Success', { id });
            return project;
        } catch (error) {
            logger.error('[FeaturedProjectService.updateFeaturedProject] Error', { err: error, id, payload });
            throw error;
        }
    }

    // Xoá dự án tiêu biểu
    async deleteFeaturedProject(id: string) {
        logger.info('[FeaturedProjectService.deleteFeaturedProject] Attempt', { id });

        try {
            const project = await FeaturedProject.findByIdAndDelete(id);

            if (!project) {
                logger.warn('[FeaturedProjectService.deleteFeaturedProject] Not found', { id });
                throw new NotFoundException('Dự án tiêu biểu');
            }

            logger.info('[FeaturedProjectService.deleteFeaturedProject] Success', { id });
            return project;
        } catch (error) {
            logger.error('[FeaturedProjectService.deleteFeaturedProject] Error', { err: error, id });
            throw error;
        }
    }
}

export default new FeaturedProjectService();

