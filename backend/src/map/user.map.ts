import { IUserDocument, IUserResponse } from '../interfaces/User.interface';

export const mapUserResponse = (user: IUserDocument): IUserResponse => {
    return {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
    };
};
