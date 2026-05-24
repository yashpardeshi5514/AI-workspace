import { Tool, AgentMessage } from '../tools/definitions';
export declare abstract class Agent {
    name: string;
    systemPrompt: string;
    tools: Tool[];
    constructor(name: string, systemPrompt: string, tools?: Tool[]);
    run(messages: AgentMessage[]): Promise<string>;
}
//# sourceMappingURL=Agent.d.ts.map