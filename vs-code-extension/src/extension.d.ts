import * as vscode from 'vscode';
export declare class AIWorkspaceExtension {
    private context;
    private serverUrl;
    private apiKey;
    constructor(context: vscode.ExtensionContext);
    activate(): void;
    private openChatPanel;
    private executeSelectedCode;
    private sendSelectionToChat;
    private getChatHtml;
}
export declare function activate(context: vscode.ExtensionContext): void;
export declare function deactivate(): void;
//# sourceMappingURL=extension.d.ts.map