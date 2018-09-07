import React from 'react'
import ReactDOM from 'react-dom'

// Your top level component
import App from './App'

// Export your top level component as JSX (for static rendering)
export default App

// Render your app
if (typeof document !== 'undefined') {
  const render = Comp => {
    ReactDOM.render(<Comp />, document.getElementById('root'))
  }

  // Render!
  render(App)
}
