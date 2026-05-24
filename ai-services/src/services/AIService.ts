import { orchestrator } from '../orchestrator/AgentOrchestrator';
import { AgentMessage } from '../tools/definitions';

export class AIService {
  async processMessage(userMessage: string, conversationHistory: any[] = []): Promise<string> {
    const messages: AgentMessage[] = [
      ...conversationHistory.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: userMessage },
    ];

    const { response } = await orchestrator.routeAuto(messages);
    return response;
  }
}

export const aiService = new AIService();
