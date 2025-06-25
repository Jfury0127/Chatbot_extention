"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function activate(context) {
    let chatHistory = context.globalState.get('chatHistory', []);
    const disposable = vscode.commands.registerCommand('chatbot-vscode.openChat', () => {
        const panel = vscode.window.createWebviewPanel('chatbot', 'ChatBot', vscode.ViewColumn.Beside, {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(context.extensionPath, 'media'))
            ]
        });
        const indexPath = path.join(context.extensionPath, 'media', 'index.html');
        let html = fs.readFileSync(indexPath, 'utf8');
        // Fix asset paths
        html = html.replace(/"(\/assets\/.*?)"/g, (_, assetPath) => {
            const assetUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, 'media', assetPath)));
            return `"${assetUri}"`;
        });
        panel.webview.html = html;
        panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case 'ready':
                    panel.webview.postMessage({ command: 'loadHistory', history: chatHistory });
                    break;
                case 'saveHistory':
                    chatHistory = message.history;
                    context.globalState.update('chatHistory', chatHistory);
                    break;
            }
        });
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
