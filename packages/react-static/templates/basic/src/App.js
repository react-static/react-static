import React from 'react'
import { Root, Routes, ErrorBoundary } from 'react-static'
//
import { Link } from 'components/Router'

import './app.css'

function App() {
  return (
    <ErrorBoundary>
      <Root>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/test">Test</Link>
        </nav>
        <div className="content">
          <React.Suspense fallback={<em>Loading...</em>}>
            <Routes />
          </React.Suspense>
        </div>
      </Root>
    </ErrorBoundary>
  )
}

export default App
