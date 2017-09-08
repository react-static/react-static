import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
//
import App from './App'

ReactDOM.render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('root'),
)

// Hot Module Replacement API
if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    ReactDOM.render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      document.getElementById('root'),
    )
  })
}
