import { Message } from '../models/Message';


export class MessageService {
  async saveMessage(
    workspaceId: string,
    userId: string,
    content: string,
    role: 'user' | 'assistant'
  ) {
    const message = await Message.create({
      workspaceId,
      userId,
      content,
      role,
    });
    return message;
  }

  async getMessages(workspaceId: string, limit = 50) {
    return await Message.find({ workspaceId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async clearMessages(workspaceId: string) {
    return await Message.deleteMany({ workspaceId });
  }
}

export const messageService = new MessageService();
