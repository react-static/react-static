import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

// Your top level component
import App from './App'

// Export your top level component (for static rendering)
export default App

// Render your app
if (typeof document !== 'undefined') {
  const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate
  const render = (Comp: React.ComponentType) => {
    renderMethod(
      <AppContainer>
        <Comp />
      </AppContainer>,
      document.getElementById('root'),
    )
  }

  // Render!
  render(App)

  // Hot Module Replacement
  if (module.hot) {
    module.hot.accept('./App', () => {
      render(require('./App').default)
    })
  }
}
