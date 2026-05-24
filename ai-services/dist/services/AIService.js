import { orchestrator } from '../orchestrator/AgentOrchestrator';
export class AIService {
    async processMessage(userMessage, conversationHistory = []) {
        const messages = [
            ...conversationHistory.map(m => ({
                role: m.role,
                content: m.content,
            })),
            { role: 'user', content: userMessage },
        ];
        const { response } = await orchestrator.routeAuto(messages);
        return response;
    }
}
export const aiService = new AIService();
//# sourceMappingURL=AIService.js.map