import { ChatHistory, Conversation } from '../models/ChatHistory';
export class ChatService {
    async createConversation(workspaceId, userId, title) {
        const conv = await Conversation.create({
            workspaceId,
            userId,
            title,
            lastMessageAt: new Date(),
        });
        return conv;
    }
    async getConversations(workspaceId, limit = 50) {
        return await Conversation.find({ workspaceId })
            .sort({ pinned: -1, createdAt: -1 })
            .limit(limit);
    }
    async getConversation(conversationId) {
        return await Conversation.findById(conversationId);
    }
    async saveMessage(conversationId, workspaceId, userId, role, content, metadata) {
        const msg = await ChatHistory.create({
            conversationId,
            workspaceId,
            userId,
            role,
            content,
            metadata,
        });
        // Update conversation
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessageAt: new Date(),
            $inc: { messageCount: 1 },
        });
        return msg;
    }
    async getMessages(conversationId, limit = 100, skip = 0) {
        return await ChatHistory.find({ conversationId })
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);
    }
    async searchConversations(workspaceId, query) {
        return await Conversation.find({
            workspaceId,
            $or: [
                { title: new RegExp(query, 'i') },
                { summary: new RegExp(query, 'i') },
            ],
        }).sort({ createdAt: -1 });
    }
    async searchMessages(workspaceId, query, limit = 20) {
        return await ChatHistory.find({
            workspaceId,
            content: new RegExp(query, 'i'),
        })
            .sort({ createdAt: -1 })
            .limit(limit);
    }
    async pinConversation(conversationId, pinned) {
        return await Conversation.findByIdAndUpdate(conversationId, { pinned });
    }
    async updateConversationTitle(conversationId, title) {
        return await Conversation.findByIdAndUpdate(conversationId, { title });
    }
    async deleteConversation(conversationId) {
        await ChatHistory.deleteMany({ conversationId });
        return await Conversation.findByIdAndDelete(conversationId);
    }
    async getConversationSummary(conversationId) {
        const messages = await ChatHistory.find({ conversationId })
            .sort({ createdAt: 1 })
            .limit(5);
        return messages
            .map(m => `${m.role}: ${m.content.slice(0, 100)}`)
            .join('\n');
    }
}
export const chatService = new ChatService();
//# sourceMappingURL=ChatService.js.map