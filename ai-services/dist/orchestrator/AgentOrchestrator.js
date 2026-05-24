import { CodeAgent, ResearchAgent, DebugAgent, GeneralAgent } from './index';
export class AgentOrchestrator {
    constructor() {
        this.agents = new Map();
        this.agents.set('code', new CodeAgent());
        this.agents.set('research', new ResearchAgent());
        this.agents.set('debug', new DebugAgent());
        this.agents.set('general', new GeneralAgent());
    }
    async route(type, messages) {
        const agent = this.agents.get(type) || this.agents.get('general');
        return await agent.run(messages);
    }
    async routeAuto(messages) {
        // Analyze user message to determine best agent
        const lastMessage = messages[messages.length - 1]?.content || '';
        let type = 'general';
        if (lastMessage.match(/code|write|debug|function|implement|fix bug/i)) {
            type = 'code';
        }
        else if (lastMessage.match(/search|find|look up|research|what is/i)) {
            type = 'research';
        }
        else if (lastMessage.match(/debug|error|broken|issue|why|not working/i)) {
            type = 'debug';
        }
        const response = await this.route(type, messages);
        return { type, response };
    }
}
export const orchestrator = new AgentOrchestrator();
//# sourceMappingURL=AgentOrchestrator.js.map