import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'

// Your top level component
import App from './App'

// Your Material UI Custom theme
import theme from './theme'

// Export your top level component as JSX (for static rendering)
export default App

// Render your app
if (typeof document !== 'undefined') {
  const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate
  const muiTheme = createMuiTheme(theme)

  const render = Comp => {
    renderMethod(
      <AppContainer>
        <MuiThemeProvider theme={muiTheme}>
          <Comp />
        </MuiThemeProvider>
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
