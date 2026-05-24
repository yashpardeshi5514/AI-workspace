import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  email: string;
  name: string;
  passwordHash: string;
  comparePassword(password: string): Promise<boolean>;
}

export interface UserModel extends mongoose.Model<IUser> {
  hashPassword(password: string): Promise<string>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    name: {
      type: String,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = async function (password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete (ret as any).passwordHash;
    return ret;
  },
});

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
