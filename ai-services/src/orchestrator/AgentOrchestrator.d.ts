import { AgentMessage } from '../tools/definitions';
export type AgentType = 'code' | 'research' | 'debug' | 'general';
export declare class AgentOrchestrator {
    private agents;
    constructor();
    route(type: AgentType, messages: AgentMessage[]): Promise<string>;
    routeAuto(messages: AgentMessage[]): Promise<{
        type: AgentType;
        response: string;
    }>;
}
export declare const orchestrator: AgentOrchestrator;
//# sourceMappingURL=AgentOrchestrator.d.ts.map