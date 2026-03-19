import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        status: { type: String, required: false },
    },
    {
        timestamps: true,
    },
);

CategorySchema.index({
    updatedAt: -1,
});

export const Category = mongoose.model('Categories', CategorySchema);
