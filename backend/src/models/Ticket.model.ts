import mongoose from 'mongoose';
import { TICKET_STATUS } from '../constants/enum.status';

const TicketSchema = new mongoose.Schema(
    {
        fullname: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: false },
        description: { type: String, required: false },
        status: {
            type: String,
            enum: Object.values(TICKET_STATUS),
            default: TICKET_STATUS.OPEN,
            lowercase: true,
        },
    },
    {
        timestamps: true,
    },
);

TicketSchema.index({
    createdAt: -1,
});

export const Ticket = mongoose.model('Tickets', TicketSchema);
