import logger from '../utils/logger';
import { NotFoundException } from '../utils/ErrorHandler';
import { JobDescription } from '../models/JobDescription.model';
import jdService from '../services/jd.service';
import { IJDFilter } from '../interfaces/JD.interface';

// Mock các dependencies
jest.mock('../models/JobDescription.model');
jest.mock('../utils/logger');

describe('JDService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createJD', () => {
        const mockPayload = {
            title: 'test',
            position: 'Backend Developer',
            salary: '100',
            experience: '1',
            level: 'junior',
            jobType: 'fulltime',
            gender: 'no',
            location: 'Hà Nội',
            description: 'Mô tả công việc backend',
            requirements: 'Có kinh nghiệm Node.js',
            benefits: 'Lương tháng 13',
            quantity: 2,
            expiredAt: new Date('2026-12-31'),
        };

        it('nên tạo jd thành công', async () => {
            (JobDescription.prototype.save as jest.Mock).mockResolvedValue(mockPayload);

            const result = await jdService.createJD(mockPayload);

            expect(result).toEqual(mockPayload);
            expect(JobDescription.prototype.save).toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalled();
        });
    });

    describe('getJDs - filter', () => {
        it('nên build query đúng từ IJDFilter', async () => {
            const mockPosts = [{ title: 'Post 1' }];
            const mockTotal = 1;

            const mockQueryChain = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockPosts),
            };

            const findSpy = jest
                .spyOn(JobDescription, 'find')
                .mockImplementation(() => mockQueryChain as unknown as ReturnType<typeof JobDescription.find>);

            jest.spyOn(JobDescription, 'countDocuments').mockResolvedValue(mockTotal);

            const filterPayload: IJDFilter = {
                page: 1,
                limit: 10,
                title: 'node',
                location: 'Ha Noi',
            };

            const result = await jdService.getJDs(filterPayload);

            expect(findSpy).toHaveBeenCalledWith({
                title: { $regex: 'node', $options: 'i' },
                location: { $regex: 'Ha Noi', $options: 'i' },
            });

            expect(result.data).toEqual(mockPosts);
            expect(result.pagination.total).toBe(1);
            expect(result.pagination.totalPages).toBe(1);
        });
    });

    describe('getJD', () => {
        it('nên trả về jd nếu tìm thấy ID', async () => {
            const mockPost = { _id: '123', title: 'Test' };
            (JobDescription.findById as jest.Mock).mockResolvedValue(mockPost);

            const result = await jdService.getJD('123');

            expect(result).toEqual(mockPost);
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy ID', async () => {
            (JobDescription.findById as jest.Mock).mockResolvedValue(null);

            await expect(jdService.getJD('999')).rejects.toThrow(NotFoundException);

            expect(logger.warn).toHaveBeenCalled();
        });
    });

    describe('updateJD', () => {
        const id = '123';

        it('nên cập nhật jd thành công', async () => {
            const payload = {
                title: 'Title Post',
            };
            const mockUpdatedPost = { _id: id, ...payload };

            (JobDescription.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedPost);

            const result = await jdService.updateJD(payload, id);

            expect(JobDescription.findByIdAndUpdate).toHaveBeenCalledWith(id, { $set: payload }, { new: true });
            expect(result).toEqual(mockUpdatedPost);
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy ID', async () => {
            (JobDescription.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(jdService.updateJD({ title: 'test' }, '999')).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteJD', () => {
        it('nên xoá jd thành công', async () => {
            (JobDescription.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '123' });

            const result = await jdService.deleteJD('123');

            expect(JobDescription.findByIdAndDelete).toHaveBeenCalledWith('123');
            expect(result).toBeDefined();
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy ID', async () => {
            (JobDescription.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

            await expect(jdService.deleteJD('999')).rejects.toThrow(NotFoundException);
        });
    });
});
