import bcrypt from 'bcrypt';
import ENV from '../constants/enviroment.constant';
import { User } from '../models/User.model';

export const seedAdmin = async () => {
    const username = ENV.ADMIN_USERNAME;
    if (!username) {
        return;
    }
    const adminExists = await User.findOne({ username });
    if (adminExists) {
        return;
    }

    const hashedPassword = await bcrypt.hash(ENV.ADMIN_PASSWORD as string, 10);

    await User.create({
        username,
        password: hashedPassword,
        name: 'admin',
    });
};
