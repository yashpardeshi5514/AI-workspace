export interface Tool {
    name: string;
    description: string;
    parameters: {
        type: string;
        properties: Record<string, any>;
        required: string[];
    };
}
export interface ToolCall {
    name: string;
    args: Record<string, any>;
}
export interface AgentMessage {
    role: 'user' | 'assistant';
    content: string;
}
export interface AgentResponse {
    content: string;
    toolCalls?: ToolCall[];
}
export declare const TOOLS: Record<string, Tool>;
//# sourceMappingURL=definitions.d.ts.map