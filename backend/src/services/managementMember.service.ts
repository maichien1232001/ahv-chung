import { IManagementMember, IManagementMemberFilter } from '../interfaces/ManagementMember.interface';
import { ManagementMember } from '../models/ManagementMember.model';
import logger from '../utils/logger';
import { DupplicateException, NotFoundException } from '../utils/ErrorHandler';

class ManagementMemberService {
    // Lấy thành viên ban quản lý theo ID
    async getManagementMemberById(id: string) {
        logger.info('[ManagementMemberService.getManagementMemberById] Attempt', { id });

        try {
            const member = await ManagementMember.findById(id);

            if (!member) {
                logger.warn('[ManagementMemberService.getManagementMemberById] Not found', { id });
                throw new NotFoundException('Thành viên ban quản lý');
            }

            return member;
        } catch (error) {
            logger.error('[ManagementMemberService.getManagementMemberById] Error', { err: error, id });
            throw error;
        }
    }

    // Lấy danh sách thành viên ban quản lý
    async getManagementMembers(payload: IManagementMemberFilter) {
        logger.info('[ManagementMemberService.getManagementMembers] Payload', { payload });

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

            const [members, total] = await Promise.all([
                ManagementMember.find(query).sort({ order: 1, updatedAt: -1 }).skip(skip).limit(limit).lean(),
                ManagementMember.countDocuments(query),
            ]);

            logger.info('[ManagementMemberService.getManagementMembers] Fetched members', { count: members.length });

            return {
                data: members,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            };
        } catch (error) {
            logger.error('[ManagementMemberService.getManagementMembers] Error', { err: error });
            throw error;
        }
    }

    // Tạo thành viên ban quản lý mới
    async createManagementMember(payload: IManagementMember) {
        logger.info('[ManagementMemberService.createManagementMember] Attempt', { payload });

        try {
            const { name, position } = payload;
            const existed = await ManagementMember.findOne({ name, position });

            if (existed) {
                logger.warn('[ManagementMemberService.createManagementMember] Duplicate member', { name, position });
                throw new DupplicateException('Thành viên ban quản lý');
            }

            const newMember = new ManagementMember(payload);
            const savedMember = await newMember.save();

            logger.info('[ManagementMemberService.createManagementMember] Success', {
                id: savedMember._id,
                name,
                position,
            });

            return savedMember;
        } catch (error) {
            logger.error('[ManagementMemberService.createManagementMember] Error', { err: error, payload });
            throw error;
        }
    }

    // Cập nhật thành viên ban quản lý
    async updateManagementMember(id: string, payload: Partial<IManagementMember>) {
        logger.info('[ManagementMemberService.updateManagementMember] Attempt', { id, payload });

        try {
            if (payload.name || payload.position) {
                const existed = await ManagementMember.findOne({
                    name: payload.name,
                    position: payload.position,
                } as { name: string; position: string });

                if (existed && existed._id.toString() !== id) {
                    logger.warn('[ManagementMemberService.updateManagementMember] Duplicate member', {
                        id,
                        name: payload.name,
                        position: payload.position,
                    });
                    throw new DupplicateException('Thành viên ban quản lý');
                }
            }

            const member = await ManagementMember.findByIdAndUpdate(id, { $set: payload }, { new: true });

            if (!member) {
                logger.warn('[ManagementMemberService.updateManagementMember] Not found', { id });
                throw new NotFoundException('Thành viên ban quản lý');
            }

            logger.info('[ManagementMemberService.updateManagementMember] Success', { id });
            return member;
        } catch (error) {
            logger.error('[ManagementMemberService.updateManagementMember] Error', { err: error, id, payload });
            throw error;
        }
    }

    // Xoá thành viên ban quản lý
    async deleteManagementMember(id: string) {
        logger.info('[ManagementMemberService.deleteManagementMember] Attempt', { id });

        try {
            const member = await ManagementMember.findByIdAndDelete(id);

            if (!member) {
                logger.warn('[ManagementMemberService.deleteManagementMember] Not found', { id });
                throw new NotFoundException('Thành viên ban quản lý');
            }

            logger.info('[ManagementMemberService.deleteManagementMember] Success', { id });
            return member;
        } catch (error) {
            logger.error('[ManagementMemberService.deleteManagementMember] Error', { err: error, id });
            throw error;
        }
    }
}

export default new ManagementMemberService();

