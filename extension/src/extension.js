const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function activate(context) {
  // Retrieve saved chat history or default to empty array
  let chatHistory = context.globalState.get('chatHistory', []);

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

    // Read your frontend's built index.html
    const indexPath = path.join(context.extensionPath, 'media', 'index.html');
    let html = fs.readFileSync(indexPath, 'utf8');

    // Fix asset paths so they load inside the webview
    html = html.replace(/"(\/assets\/.*?)"/g, (_, assetPath) => {
      const assetUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'media', assetPath))
      );
      return `"${assetUri}"`;
    });

    panel.webview.html = html;

    // Listen for messages from the webview
    panel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case 'ready':
          // When webview says it's ready, send saved chat history
          panel.webview.postMessage({ command: 'loadHistory', history: chatHistory });
          break;

        case 'saveHistory':
          // Save updated chat history persistently
          chatHistory = message.history;
          context.globalState.update('chatHistory', chatHistory);
          break;
      }
    });
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
