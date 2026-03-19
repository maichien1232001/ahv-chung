import { Ticket } from '../models/Ticket.model';
import { NotFoundException } from '../utils/ErrorHandler';
import logger from '../utils/logger';
import ticketService from './ticket.service';

jest.mock('../models/Ticket.model');
jest.mock('../utils/logger');

describe('TicketSerrvice', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createTicket()', () => {
        it('nên tạo người dùng thành công', async () => {
            const mockPayload = {
                fullname: 'name 1',
                phone: '0987654321',
                email: 'user1@gmail.com',
                description: 'user 1 ticket',
            };
            (Ticket.prototype.save as jest.Mock).mockResolvedValue(mockPayload);

            const result = await ticketService.createTicket(mockPayload);

            expect(result).toEqual(mockPayload);
            expect(logger.info).toHaveBeenCalled();
        });
    });

    describe('getUsers()', () => {
        it('nên trả về danh sách người dùng phân trang', async () => {
            const mockTicket = [
                { fullname: 'user1', phone: '098876555', email: 'user1@gmail.com' },
                { fullname: 'user2', phone: '098876554', email: 'user2@gmail.com' },
            ];
            const mockQuery = {
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                lean: jest.fn().mockReturnValue(mockTicket),
            };

            (Ticket.find as jest.Mock).mockReturnValue(mockQuery);
            (Ticket.countDocuments as jest.Mock).mockResolvedValue(2);

            const result = await ticketService.getTickets({ page: 1, limit: 10 });

            expect(result.data).toEqual(mockTicket);
            expect(result.pagination.total).toBe(2);
            expect(result.pagination.totalPages).toBe(1);
        });
    });

    describe('getTicket', () => {
        it('nên trả về ticket nếu tìm thấy ID', async () => {
            const mockTicket = { _id: '123', fullname: 'user1', phone: '098876555', email: 'user1@gmail.com' };
            (Ticket.findById as jest.Mock).mockResolvedValue(mockTicket);

            const result = await ticketService.getTicket('123');

            expect(result).toEqual(mockTicket);
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy ID', async () => {
            (Ticket.findById as jest.Mock).mockResolvedValue(null);

            await expect(ticketService.getTicket('999')).rejects.toThrow(NotFoundException);

            expect(logger.warn).toHaveBeenCalled();
        });
    });

    describe('updateTicket', () => {
        const id = '123';

        it('nên cập nhật ticket thành công', async () => {
            const payload = { status: 'seen' };
            const mockUpdatedTicket = {
                _id: id,
                fullname: 'user2',
                phone: '098876554',
                email: 'user2@gmail.com',
                status: 'open',
            };

            (Ticket.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedTicket);

            const result = await ticketService.updateTicket(payload, id);

            expect(Ticket.findByIdAndUpdate).toHaveBeenCalledWith(id, { $set: payload }, { new: true });
            expect(result).toEqual(mockUpdatedTicket);
        });

        it('nên ném lỗi NotFoundException nếu không tìm thấy ID', async () => {
            (Ticket.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

            await expect(ticketService.updateTicket({ status: 'abc' }, '999')).rejects.toThrow(NotFoundException);
        });
    });
});
