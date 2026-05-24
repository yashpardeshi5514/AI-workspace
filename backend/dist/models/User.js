import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
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
}, { timestamps: true });
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.passwordHash);
};
userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};
userSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.passwordHash;
        return ret;
    },
});
export const User = mongoose.model('User', userSchema);
//# sourceMappingURL=User.js.map