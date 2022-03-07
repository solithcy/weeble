import React from 'react';
import ReactDOM from 'react-dom';
import './resources/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import events from "./ext/events";

document.addEventListener("keyup", (e) => {
    if(e.keyCode === 8) {
        events.dispatch("letterTyped", "backspace")
    }else if(e.keyCode === 13) {
        events.dispatch("letterTyped", "enter")
    } else if(e.keyCode >= 65 && e.keyCode <= 90) {
        events.dispatch("letterTyped", String.fromCharCode(e.keyCode).toLowerCase())
    }
});
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
