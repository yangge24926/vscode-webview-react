import React from "react";
import ReactDOM from "react-dom";
import App from "./App";


if(!(window as any)._imgUri) {
  (window as any)._imgUri = '';
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
