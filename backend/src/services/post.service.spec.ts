import logger from '../utils/logger';
import { NotFoundException } from '../utils/ErrorHandler';
import { Post } from '../models/Post.model';
import postService from '../services/post.service';
import { Category } from '../models/Category.model';
import { IPostFilter } from '../interfaces/Post.interface';

// Mock các dependencies
jest.mock('../models/Post.model');
jest.mock('../utils/logger');
jest.mock('../models/Category.model');

describe('PostService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createPost', () => {
        const mockPayload = {
            title: 'Title Post',
            content: 'content post',
            categoryId: '1',
            tags: ['hot'],
            imageUrl: 'ht',
            status: 'public',
        };

        it('nên tạo post thành công', async () => {
            (Category.findById as jest.Mock).mockResolvedValue({ _id: '1' });
            (Post.prototype.save as jest.Mock).mockResolvedValue(mockPayload);

            const result = await postService.createPost(mockPayload);

            expect(result).toEqual(mockPayload);
            expect(Category.findById).toHaveBeenCalledWith('1');
            expect(Post.prototype.save).toHaveBeenCalled();
            expect(logger.info).toHaveBeenCalled();
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy category', async () => {
            (Category.findById as jest.Mock).mockResolvedValue(null);

            await expect(postService.createPost(mockPayload)).rejects.toThrow(NotFoundException);

            expect(Post.prototype.save).not.toHaveBeenCalled();
        });
    });

    describe('getPosts - filter', () => {
        it('nên build query đúng từ IPostFilter', async () => {
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
                .spyOn(Post, 'find')
                .mockImplementation(() => mockQueryChain as unknown as ReturnType<typeof Post.find>);

            jest.spyOn(Post, 'countDocuments').mockResolvedValue(mockTotal);

            const filterPayload: IPostFilter = {
                page: 1,
                limit: 10,
                title: 'node',
                categoryId: '123',
                status: 'public',
                tags: 'hot,new',
            };

            const result = await postService.getPosts(filterPayload);

            // ✅ QUAN TRỌNG NHẤT: test query build từ filter
            expect(findSpy).toHaveBeenCalledWith({
                title: { $regex: 'node', $options: 'i' },
                categoryId: '123',
                status: 'public',
                tags: { $in: ['hot', 'new'] },
            });

            expect(result.data).toEqual(mockPosts);
            expect(result.pagination.total).toBe(1);
            expect(result.pagination.totalPages).toBe(1);
        });
    });

    describe('getPost', () => {
        it('nên trả về post nếu tìm thấy ID', async () => {
            const mockPost = { _id: '123', title: 'Test' };
            (Post.findById as jest.Mock).mockResolvedValue(mockPost);

            const result = await postService.getPost('123');

            expect(result).toEqual(mockPost);
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy ID', async () => {
            (Post.findById as jest.Mock).mockResolvedValue(null);

            await expect(postService.getPost('999')).rejects.toThrow(NotFoundException);

            expect(logger.warn).toHaveBeenCalled();
        });
    });

    describe('updatePost', () => {
        const id = '123';

        it('nên cập nhật post thành công', async () => {
            const payload = {
                title: 'Title Post',
                content: 'content post',
                categoryId: '1',
                tags: ['new'],
                imageUrl: 'ht',
                status: 'public',
            };
            const mockUpdatedPost = { _id: id, ...payload };

            (Post.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedPost);

            const result = await postService.updatePost(payload, id);

            expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(id, { $set: payload }, { new: true });
            expect(result).toEqual(mockUpdatedPost);
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy ID', async () => {
            (Post.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(
                postService.updatePost({ title: 'test', content: 'test', categoryId: 'test' }, '999'),
            ).rejects.toThrow(NotFoundException);
        });
    });

    describe('deletePost', () => {
        it('nên xoá post thành công', async () => {
            (Post.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: '123' });

            const result = await postService.deletePost('123');

            expect(Post.findByIdAndDelete).toHaveBeenCalledWith('123');
            expect(result).toBeDefined();
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy ID', async () => {
            (Post.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

            await expect(postService.deletePost('999')).rejects.toThrow(NotFoundException);
        });
    });
});
