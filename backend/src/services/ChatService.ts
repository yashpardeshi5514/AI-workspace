import { ChatHistory, Conversation } from '../models/ChatHistory';

export class ChatService {
  async createConversation(
    workspaceId: string,
    userId: string,
    title: string
  ) {
    const conv = await Conversation.create({
      workspaceId,
      userId,
      title,
      lastMessageAt: new Date(),
    });
    return conv;
  }

  async getConversations(workspaceId: string, limit: number = 50) {
    return await Conversation.find({ workspaceId })
      .sort({ pinned: -1, createdAt: -1 })
      .limit(limit);
  }

  async getConversation(conversationId: string) {
    return await Conversation.findById(conversationId);
  }

  async saveMessage(
    conversationId: string,
    workspaceId: string,
    userId: string,
    role: 'user' | 'assistant',
    content: string,
    metadata?: any
  ) {
    const msg = await ChatHistory.create({
      conversationId,
      workspaceId,
      userId,
      role,
      content,
      metadata,
    });

    // Update conversation
    await Conversation.findByIdAndUpdate(
      conversationId,
      {
        lastMessageAt: new Date(),
        $inc: { messageCount: 1 },
      }
    );

    return msg;
  }

  async getMessages(
    conversationId: string,
    limit: number = 100,
    skip: number = 0
  ) {
    return await ChatHistory.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
  }

  async searchConversations(workspaceId: string, query: string) {
    return await Conversation.find(
      {
        workspaceId,
        $or: [
          { title: new RegExp(query, 'i') },
          { summary: new RegExp(query, 'i') },
        ],
      }
    ).sort({ createdAt: -1 });
  }

  async searchMessages(workspaceId: string, query: string, limit: number = 20) {
    return await ChatHistory.find(
      {
        workspaceId,
        content: new RegExp(query, 'i'),
      }
    )
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async pinConversation(conversationId: string, pinned: boolean) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { pinned }
    );
  }

  async updateConversationTitle(conversationId: string, title: string) {
    return await Conversation.findByIdAndUpdate(
      conversationId,
      { title }
    );
  }

  async deleteConversation(conversationId: string) {
    await ChatHistory.deleteMany({ conversationId });
    return await Conversation.findByIdAndDelete(conversationId);
  }

  async getConversationSummary(conversationId: string): Promise<string> {
    const messages = await ChatHistory.find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(5);

    return messages
      .map(m => `${m.role}: ${m.content.slice(0, 100)}`)
      .join('\n');
  }
}

export const chatService = new ChatService();
