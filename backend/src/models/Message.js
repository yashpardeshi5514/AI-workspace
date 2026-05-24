import mongoose from 'mongoose';
const messageSchema = new mongoose.Schema({
    workspaceId: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
}, { timestamps: true });
export const Message = mongoose.model('Message', messageSchema);
//# sourceMappingURL=Message.js.map