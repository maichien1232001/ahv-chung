import mongoose from 'mongoose';
import { USER_STATUS } from '../constants/enum.status';

const CustomerFeedbackSchema = new mongoose.Schema(
    {
        customerName: { type: String, required: true },
        content: { type: String, required: true },
        position: { type: String },
        company: { type: String },
        avatarUrl: { type: String },
        order: { type: Number, default: 0 },
        status: {
            type: String,
            enum: Object.values(USER_STATUS),
            default: USER_STATUS.ACTIVE,
            lowercase: true,
        },
    },
    {
        timestamps: true,
    },
);

CustomerFeedbackSchema.index({
    updatedAt: -1,
});

export const CustomerFeedback = mongoose.model('CustomerFeedbacks', CustomerFeedbackSchema);

