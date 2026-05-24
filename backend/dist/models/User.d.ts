import mongoose from 'mongoose';
export interface IUser extends mongoose.Document {
    email: string;
    name: string;
    passwordHash: string;
    comparePassword(password: string): Promise<boolean>;
}
export interface UserModel extends mongoose.Model<IUser> {
    hashPassword(password: string): Promise<string>;
}
export declare const User: UserModel;
//# sourceMappingURL=User.d.ts.map