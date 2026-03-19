import mongoose from 'mongoose';
import { USER_STATUS } from '../constants/enum.status';

const CoreValueSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        icon: { type: String },
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

CoreValueSchema.index({
    updatedAt: -1,
});

export const CoreValue = mongoose.model('CoreValues', CoreValueSchema);

