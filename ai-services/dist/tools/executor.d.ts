import { ToolCall } from './definitions';
export declare class ToolExecutor {
    execute(toolCall: ToolCall): Promise<string>;
    private readFile;
    private writeFile;
    private executeCode;
    private searchDocumentation;
}
export declare const toolExecutor: ToolExecutor;
//# sourceMappingURL=executor.d.ts.map