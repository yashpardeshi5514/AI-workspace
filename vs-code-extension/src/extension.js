import * as vscode from 'vscode';
import * as axios from 'axios';
export class AIWorkspaceExtension {
    constructor(context) {
        this.context = context;
        this.serverUrl =
            vscode.workspace
                .getConfiguration('aiWorkspace')
                .get('serverUrl') || 'http://localhost:3001';
        this.apiKey =
            vscode.workspace
                .getConfiguration('aiWorkspace')
                .get('apiKey') || '';
    }
    activate() {
        // Chat command
        this.context.subscriptions.push(vscode.commands.registerCommand('ai-workspace.openChat', () => {
            this.openChatPanel();
        }));
        // Execute code command
        this.context.subscriptions.push(vscode.commands.registerCommand('ai-workspace.executeCode', () => {
            this.executeSelectedCode();
        }));
        // Send selection command
        this.context.subscriptions.push(vscode.commands.registerCommand('ai-workspace.sendSelection', () => {
            this.sendSelectionToChat();
        }));
        vscode.window.showInformationMessage('AI Workspace activated!');
    }
    openChatPanel() {
        const panel = vscode.window.createWebviewPanel('aiWorkspaceChat', 'AI Workspace Chat', vscode.ViewColumn.Two, { enableScripts: true });
        panel.webview.html = this.getChatHtml();
    }
    async executeSelectedCode() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No file open');
            return;
        }
        const selection = editor.selection;
        const code = editor.document.getText(selection);
        const language = editor.document.languageId;
        try {
            const response = await axios.post(`${this.serverUrl}/api/execute/execute`, { code, language }, {
                headers: { Authorization: `Bearer ${this.apiKey}` },
            });
            const result = response.data;
            // Show output
            const panel = vscode.window.createWebviewPanel('executionResult', 'Execution Result', vscode.ViewColumn.Two);
            panel.webview.html = `
        <html>
          <body style="padding: 20px; font-family: monospace;">
            <h2>${result.success ? '✓ Success' : '✗ Error'}</h2>
            <pre>${result.output || result.error}</pre>
            <small>Duration: ${result.duration}ms</small>
          </body>
        </html>
      `;
        }
        catch (err) {
            vscode.window.showErrorMessage('Execution failed');
        }
    }
    sendSelectionToChat() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No file open');
            return;
        }
        const selection = editor.selection;
        const code = editor.document.getText(selection);
        // Send to chat (would integrate with chat panel)
        vscode.window.showInformationMessage(`Sent ${code.length} characters to chat`);
    }
    getChatHtml() {
        return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              padding: 20px;
              background: #1e1e1e;
              color: #e0e0e0;
            }
            .message {
              margin: 10px 0;
              padding: 10px;
              border-radius: 5px;
              background: #2d2d2d;
            }
            .input-area {
              margin-top: 20px;
              display: flex;
              gap: 10px;
            }
            input {
              flex: 1;
              padding: 10px;
              background: #2d2d2d;
              border: 1px solid #404040;
              color: #e0e0e0;
              border-radius: 3px;
            }
            button {
              padding: 10px 20px;
              background: #0e639c;
              color: white;
              border: none;
              border-radius: 3px;
              cursor: pointer;
            }
            button:hover {
              background: #1177bb;
            }
          </style>
        </head>
        <body>
          <h2>AI Workspace Chat</h2>
          <div id="messages" style="height: 300px; overflow-y: auto;"></div>
          <div class="input-area">
            <input type="text" id="input" placeholder="Ask a question..." />
            <button onclick="sendMessage()">Send</button>
          </div>

          <script>
            const vscode = acquireVsCodeApi();

            function sendMessage() {
              const input = document.getElementById('input');
              const text = input.value;

              if (text.trim()) {
                vscode.postMessage({ command: 'send', text });
                input.value = '';
              }
            }

            window.addEventListener('message', (event) => {
              const message = event.data;
              if (message.command === 'response') {
                const messages = document.getElementById('messages');
                messages.innerHTML += \`<div class="message">\${message.text}</div>\`;
              }
            });
          </script>
        </body>
      </html>
    `;
    }
}
export function activate(context) {
    const extension = new AIWorkspaceExtension(context);
    extension.activate();
}
export function deactivate() { }
//# sourceMappingURL=extension.js.map