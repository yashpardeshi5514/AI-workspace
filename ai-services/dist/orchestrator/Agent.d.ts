import { AgentMessage } from '../tools/definitions';
export declare abstract class Agent {
    abstract run(messages: AgentMessage[]): Promise<string>;
}
//# sourceMappingURL=Agent.d.ts.map