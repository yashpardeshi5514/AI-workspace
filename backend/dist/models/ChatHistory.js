import mongoose from 'mongoose';
const chatHistorySchema = new mongoose.Schema({
    workspaceId: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
        index: true,
    },
    conversationId: {
        type: String,
        required: true,
        index: true,
    },
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    metadata: {
        sourceFiles: [String],
        agentsUsed: [String],
        tokensUsed: Number,
    },
}, { timestamps: true });
// Compound index for workspace + conversation
chatHistorySchema.index({ workspaceId: 1, conversationId: 1 });
export const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
const conversationSchema = new mongoose.Schema({
    workspaceId: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    summary: String,
    messageCount: {
        type: Number,
        default: 0,
    },
    lastMessageAt: Date,
    pinned: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
conversationSchema.index({ workspaceId: 1, createdAt: -1 });
export const Conversation = mongoose.model('Conversation', conversationSchema);
//# sourceMappingURL=ChatHistory.js.map