import vscode from "./utilities/vscode";
// import { startAddEventListenerMessage } from './utilities/listenerMessage';
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import helloWorldPng from "./asserts/hello-world.png";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [theme, setTheme] = useState('')
  const [language, setLanguage] = useState('')
  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }

  useEffect(() => {
    // startAddEventListenerMessage();
    window.addEventListener('message', (event) => {
      const { type, content } = event.data;
      console.log(event)
      switch (type) {
        case 'theme':
          setTheme(content);
          break;
      
        case 'language':
          setLanguage(content);
          break;
        
      }
    });
    vscode.postMessage({
      command: 'main-loader'
    })
  }, [])

  return (
    <main>
      <h1>Hello World!</h1>
      <h2>当前主题：{theme}</h2>
      <h2>当前语言：{language}</h2>
      <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
      <div style={{
        width: '100px',
        height: '100px',
        backgroundImage: `url(${(window as any)._imgUri}${helloWorldPng})`,
        backgroundSize: '100%',
      }}></div>
      <img src={`${(window as any)._imgUri}${helloWorldPng}`} alt=""/>
      <img src={`${(window as any)._imgUri}images/logo512.png`} alt=""/>
    </main>
  );
}

export default App;
