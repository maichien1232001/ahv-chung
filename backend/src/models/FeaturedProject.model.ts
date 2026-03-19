import mongoose from 'mongoose';
import { USER_STATUS } from '../constants/enum.status';

const FeaturedProjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        customer: { type: String },
        industry: { type: String },
        thumbnailUrl: { type: String },
        link: { type: String },
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

FeaturedProjectSchema.index({
    updatedAt: -1,
});

export const FeaturedProject = mongoose.model('FeaturedProjects', FeaturedProjectSchema);

