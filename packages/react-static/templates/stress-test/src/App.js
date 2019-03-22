import React from 'react'
import { Root, Routes, ErrorBoundary } from 'react-static'
import { Link } from '@reach/router'

import './app.css'

const App = () => (
  <ErrorBoundary>
    <Root>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <div className="content">
        <React.Suspense fallback="Loading...">
          <Routes />
        </React.Suspense>
      </div>
    </Root>
  </ErrorBoundary>
)

export default App
