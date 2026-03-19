import mongoose from 'mongoose';
import { POST_STATUS } from '../constants/enum.status';

const PostSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        status: {
            type: String,
            enum: Object.values(POST_STATUS),
            default: POST_STATUS.PUBLIC,
            lowercase: true,
        },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        imageUrl: { type: String, required: false },
        tags: [String],
    },
    {
        timestamps: true,
    },
);

PostSchema.index({
    categoryId: 1,
    updatedAt: -1,
});
PostSchema.index({
    categoryId: 1,
    tags: 1,
    updatedAt: -1,
});

export const Post = mongoose.model('Posts', PostSchema);
