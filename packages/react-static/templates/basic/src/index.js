import { sheet } from 'emotion'
import React from 'react'
import ReactDOM from 'react-dom'
// import { AppContainer } from 'react-hot-loader'

// Your top level component
import App from './App'

// Export your top level component as JSX (for static rendering)
export default App

// Render your app
if (typeof document !== 'undefined') {
  const target = document.getElementById('root')

  if (!target.hasChildNodes()) {
    sheet.speedy(false)
  }

  const renderMethod = target.hasChildNodes()
    ? ReactDOM.hydrate
    : ReactDOM.render

  const render = Comp => {
    renderMethod(<Comp />, target)
  }

  // Render!
  render(App)

  // Hot Module Replacement
  if (module && module.hot) {
    module.hot.accept('./App', () => {
      render(App)
    })
  }
}
