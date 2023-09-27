import React, { ReactElement, useEffect, useState } from 'react';

import { installLanguage, _L } from './localization/lang';
import vscode from './utilities/vscode';
import './App.css';
import { formatString } from './utils';

function App() {
  const [language, setLanguage] = useState('');

  setTimeout(() => {
    installLanguage('zh-CN', setLanguage);
  }, 1000);

  useEffect(() => {
    window.addEventListener('message', (event) => {
      const { type, content } = event.data;
      switch (type) {
        case 'language':
          installLanguage(content, setLanguage);
          break;
      }
    });
    vscode.postMessage({
      command: 'main-loader',
    });
  }, []);

  let content: ReactElement | null = null;
  if (language) {
    content = (
      <main>
        <h1>{_L('Hello World!')}</h1>
        <h2>{formatString(_L('Current Language: %s'), language)}</h2>
      </main>
    );
  }

  return content;
}

export default App;
