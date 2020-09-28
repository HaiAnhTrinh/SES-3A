import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import AppRouter from './js/common/AppRouter'
import * as serviceWorker from './js/serviceWorker/serviceWorker'

const ThemeContext = React.createContext('light')

ReactDOM.render(
  <ThemeContext.Provider value='blue'>
    <AppRouter />
  </ThemeContext.Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
