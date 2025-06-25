import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface ChatMessage {
  role: string;
  content: string;
}

export function activate(context: vscode.ExtensionContext) {
  let chatHistory: ChatMessage[] = context.globalState.get<ChatMessage[]>('chatHistory', []);

  const disposable = vscode.commands.registerCommand('chatbot-vscode.openChat', () => {
    const panel = vscode.window.createWebviewPanel(
      'chatbot',
      'ChatBot',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [
          vscode.Uri.file(path.join(context.extensionPath, 'media'))
        ]
      }
    );

    const indexPath = path.join(context.extensionPath, 'media', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');

    // Fix asset paths
    html = html.replace(/"(\/assets\/.*?)"/g, (_, assetPath: string) => {
      const assetUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'media', assetPath))
      );
      return `"${assetUri}"`;
    });

    panel.webview.html = html;

    panel.webview.onDidReceiveMessage((message: any) => {
      switch (message.command) {
        case 'ready':
          panel.webview.postMessage({ command: 'loadHistory', history: chatHistory });
          break;

        case 'saveHistory':
          chatHistory = message.history as ChatMessage[];
          context.globalState.update('chatHistory', chatHistory);
          break;
      }
    });
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}
