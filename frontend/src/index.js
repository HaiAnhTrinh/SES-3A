import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LoginRouter from './js/LoginRouter';
import * as serviceWorker from './js/serviceWorker/serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <LoginRouter />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();