import { AgentMessage } from '../tools/definitions';

export abstract class Agent {
  abstract run(messages: AgentMessage[]): Promise<string>;
}