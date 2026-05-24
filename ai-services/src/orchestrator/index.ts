import { Agent } from './Agent';
import { AgentMessage } from '../tools/definitions';

export class CodeAgent extends Agent {
  async run(messages: AgentMessage[]): Promise<string> {
    // TODO: Implement OpenAI call for Code Agent
    return "I am the Code Agent."; 
  }
}

export class ResearchAgent extends Agent {
  async run(messages: AgentMessage[]): Promise<string> {
    return "I am the Research Agent."; 
  }
}

export class DebugAgent extends Agent {
  async run(messages: AgentMessage[]): Promise<string> {
    return "I am the Debug Agent."; 
  }
}

export class GeneralAgent extends Agent {
  async run(messages: AgentMessage[]): Promise<string> {
    return "I am the General Agent."; 
  }
}