import vscode from './vscode'

export function startAddEventListenerMessage() {
  console.log(22223333);
  // 在 Webview 内部添加消息监听器
  window.addEventListener('message', (event) => {
    const { type, content } = event.data;
    console.log(event)
    switch (type) {
      case 'theme':
        vscode.theme = content;
        break;
    
      case 'language':
        vscode.language = content;
        break;
      
    }
  });
}