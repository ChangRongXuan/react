import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import React from 'react';
import App from './App';

// TODO: data change to Redux
const rootElement = document.getElementById('root');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
