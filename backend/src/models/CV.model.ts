import mongoose, { Schema } from 'mongoose';
import { CV_STATUS } from '../constants/enum.status';

const CvSchema = new mongoose.Schema(
    {
        filePath: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(CV_STATUS),
            default: CV_STATUS.NEW,
            lowercase: true,
        },
        jobDescriptionId: { type: Schema.Types.ObjectId, ref: 'JobDescription', required: true },
    },
    {
        timestamps: true,
    },
);

CvSchema.index({
    updatedAt: -1,
});

CvSchema.index({
    jobDescriptionId: 1,
    updatedAt: -1,
});

export const CV = mongoose.model('CVs', CvSchema);
