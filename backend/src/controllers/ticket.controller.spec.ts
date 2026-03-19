import express from 'express';
import * as ticketController from './ticket.controller';
import ticketService from '../services/ticket.service';
import request from 'supertest';
import { Message } from '../constants/messages.contant';
import { NotFoundException } from '../utils/ErrorHandler';

const app = express();
app.use(express.json());
app.post('/tickets', ticketController.createTicket);
app.get('/tickets', ticketController.getTickets);
app.get('/tickets/:id', ticketController.getTicket);
app.put('/tickets/:id', ticketController.updateTicket);

jest.mock('../services/ticket.service');

describe('Ticket Controller Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createTicket()', () => {
        const newTicket = { fullname: 'user1', phone: '0987654321', email: 'user1@gmail.com', description: 'user1 ' };

        it('nên trả về 201 khi tạo ticket thành công', async () => {
            (ticketService.createTicket as jest.Mock).mockResolvedValue(undefined);

            const response = await request(app).post('/tickets').send(newTicket);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Yêu cầu hỗ trợ ' + Message.Messages.CREATED);
            expect(ticketService.createTicket).toHaveBeenCalledWith(newTicket);
        });

        it('nên trả về 500 khi service throw error thường', async () => {
            (ticketService.createTicket as jest.Mock).mockRejectedValue(new Error('DB error'));

            const response = await request(app).post('/tickets').send({ title: 'test' });

            expect(response.status).toBe(500);
        });
    });

    describe('getTicket', () => {
        it('nên trả về 200 và data khi tìm thấy ticket', async () => {
            const mockTicket = {
                id: '1',
                fullname: 'user1',
                phone: '0987654321',
                email: 'user1@gmail.com',
                description: 'user1 ',
            };

            (ticketService.getTicket as jest.Mock).mockResolvedValue(mockTicket);

            const response = await request(app).get('/tickets/1');

            expect(response.status).toBe(200);
            expect(response.body.data).toEqual(mockTicket);
            expect(response.body.message).toContain(Message.Messages.FOUND);
        });

        it('nên trả về 404 khi không tìm thấy ticket (NotFoundException)', async () => {
            (ticketService.getTicket as jest.Mock).mockRejectedValue(new NotFoundException('Ticket'));

            const response = await request(app).get('/tickets/999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Ticket không tồn tại');
        });
    });

    describe('getTickets', () => {
        it('nên trả về 200 và data khi tìm thấy ticket', async () => {
            const ticketsData = {
                data: [
                    {
                        _id: '1',
                        fullname: 'user1',
                        phone: '0987654321',
                        email: 'user1@gmail.com',
                        description: 'user 1',
                    },
                    {
                        _id: '2',
                        fullname: 'user2',
                        phone: '0987654322',
                        email: 'user2@gmail.com',
                        description: 'user 2',
                    },
                ],
            };
            (ticketService.getTickets as jest.Mock).mockResolvedValue(ticketsData);
            const response = await request(app).get('/tickets').query({ page: 1, limit: 10 });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Danh sách yêu cầu hỗ trợ ' + Message.Messages.FOUND);
            expect(response.body.data).toEqual(ticketsData);
        });
    });

    describe('updateTicket', () => {
        const payload = {
            status: 'resolved',
        };
        it('nên trả về 200 khi cập nhật status ticket thành công', async () => {
            const mockTicket = {
                data: [
                    {
                        _id: '1',
                        fullname: 'user1',
                        phone: '0987654321',
                        email: 'user1@gmail.com',
                        description: 'user 1',
                    },
                ],
            };
            (ticketService.updateTicket as jest.Mock).mockResolvedValueOnce(mockTicket);
            const response = await request(app).put('/tickets/1').send(payload);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Trạng thái yêu cầu hỗ trợ ' + Message.Messages.UPDATED);
        });

        it('nên trả về 404 khi không tìm thấy ticket (NotFoundException)', async () => {
            (ticketService.getTicket as jest.Mock).mockRejectedValue(new NotFoundException('Ticket'));

            const response = await request(app).get('/tickets/999');

            expect(response.status).toBe(404);
            expect(response.body.message).toBe('Ticket không tồn tại');
        });
    });
});
