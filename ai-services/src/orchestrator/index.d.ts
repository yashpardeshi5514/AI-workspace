import { Agent } from './Agent';
import { AgentMessage } from '../tools/definitions';
export declare class CodeAgent extends Agent {
    run(messages: AgentMessage[]): Promise<string>;
}
export declare class ResearchAgent extends Agent {
    run(messages: AgentMessage[]): Promise<string>;
}
export declare class DebugAgent extends Agent {
    run(messages: AgentMessage[]): Promise<string>;
}
export declare class GeneralAgent extends Agent {
    run(messages: AgentMessage[]): Promise<string>;
}
//# sourceMappingURL=index.d.ts.map