import { Agent } from './Agent';
import { CodeAgent, ResearchAgent, DebugAgent, GeneralAgent } from './index';
import { AgentMessage } from '../tools/definitions';

export type AgentType = 'code' | 'research' | 'debug' | 'general';

export class AgentOrchestrator {
  private agents: Map<AgentType, Agent> = new Map();

  constructor() {
    this.agents.set('code', new CodeAgent());
    this.agents.set('research', new ResearchAgent());
    this.agents.set('debug', new DebugAgent());
    this.agents.set('general', new GeneralAgent());
  }

  async route(type: AgentType, messages: AgentMessage[]): Promise<string> {
    const agent = this.agents.get(type) || this.agents.get('general')!;
    return await agent.run(messages);
  }

  async routeAuto(messages: AgentMessage[]): Promise<{ type: AgentType; response: string }> {
    // Analyze user message to determine best agent
    const lastMessage = messages[messages.length - 1]?.content || '';
    let type: AgentType = 'general';

    if (
      lastMessage.match(/code|write|debug|function|implement|fix bug/i)
    ) {
      type = 'code';
    } else if (lastMessage.match(/search|find|look up|research|what is/i)) {
      type = 'research';
    } else if (lastMessage.match(/debug|error|broken|issue|why|not working/i)) {
      type = 'debug';
    }

    const response = await this.route(type, messages);
    return { type, response };
  }
}

export const orchestrator = new AgentOrchestrator();
