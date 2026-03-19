import mongoose from 'mongoose';
import { USER_STATUS } from '../constants/enum.status';

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
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

UserSchema.index({
    updatedAt: -1,
});

export const User = mongoose.model('Users', UserSchema);
