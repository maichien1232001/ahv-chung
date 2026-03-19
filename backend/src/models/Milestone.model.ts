import mongoose from 'mongoose';
import { USER_STATUS } from '../constants/enum.status';

const MilestoneSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Number, required: true },
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

MilestoneSchema.index({
    updatedAt: -1,
});

export const Milestone = mongoose.model('Milestones', MilestoneSchema);

