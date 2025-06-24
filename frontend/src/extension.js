const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

function activate(context) {
  const disposable = vscode.commands.registerCommand('chatbot-vscode.openChat', function () {
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

    html = html.replace(/"\/(assets\/.*?)"/g, (_, assetPath) => {
      const assetUri = panel.webview.asWebviewUri(
        vscode.Uri.file(path.join(context.extensionPath, 'media', assetPath))
      );
      return `"${assetUri}"`;
    });

    panel.webview.html = html;
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
