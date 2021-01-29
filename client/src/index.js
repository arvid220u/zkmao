import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as tokens from "./tokens.js";
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

let tokenState = tokens.createTokenState([1, 2]);
tokens
  .draw(tokenState, 0, 0, 0, 0, 0, 1)
  .then((res) => console.log("n\n\n\\n\n\n\n\\n\n\n\n\n"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
