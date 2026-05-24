export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    duration: number;
    language: string;
}
export declare class CodeExecutor {
    executeJavaScript(code: string): Promise<ExecutionResult>;
    executePython(code: string): Promise<ExecutionResult>;
    executeNode(code: string): Promise<ExecutionResult>;
    execute(code: string, language: string): Promise<ExecutionResult>;
}
export declare const codeExecutor: CodeExecutor;
//# sourceMappingURL=CodeExecutor.d.ts.map