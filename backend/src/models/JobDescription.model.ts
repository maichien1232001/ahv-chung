import mongoose from 'mongoose';

const JobDescriptionSchema = new mongoose.Schema(
    {
        title: { type: String, required: false },
        position: { type: String, required: false },
        salary: { type: String, required: false },
        experience: { type: String, required: false },
        level: { type: String, required: false },
        jobType: { type: String, required: false },
        gender: { type: String, required: false },
        location: { type: String, required: false },
        description: { type: String, required: false },
        requirements: { type: String, required: false },
        benefits: { type: String, required: false },
        quantity: { type: Number, required: false },
        expiredAt: { type: Date, required: false },
    },
    {
        timestamps: true,
    },
);

JobDescriptionSchema.index({
    updatedAt: -1,
    title: 1,
    location: 1,
});

export const JobDescription = mongoose.model('JobDescriptions', JobDescriptionSchema);
