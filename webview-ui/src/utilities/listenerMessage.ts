import vscode from './vscode'

export function startAddEventListenerMessage() {
  // 在 Webview 内部添加消息监听器
  window.addEventListener('message', (event) => {
    const { type, content } = event.data;
  });
}