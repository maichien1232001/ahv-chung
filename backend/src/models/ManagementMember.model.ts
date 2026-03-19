import mongoose from 'mongoose';
import { USER_STATUS } from '../constants/enum.status';

const ManagementMemberSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        position: { type: String, required: true },
        avatarUrl: { type: String },
        description: { type: String },
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

ManagementMemberSchema.index({
    updatedAt: -1,
});

export const ManagementMember = mongoose.model('ManagementMembers', ManagementMemberSchema);

