import { Message } from '../models/Message';
export class MessageService {
    async saveMessage(workspaceId, userId, content, role) {
        const message = await Message.create({
            workspaceId,
            userId,
            content,
            role,
        });
        return message;
    }
    async getMessages(workspaceId, limit = 50) {
        return await Message.find({ workspaceId })
            .sort({ createdAt: -1 })
            .limit(limit);
    }
    async clearMessages(workspaceId) {
        return await Message.deleteMany({ workspaceId });
    }
}
export const messageService = new MessageService();
//# sourceMappingURL=MessageService.js.map