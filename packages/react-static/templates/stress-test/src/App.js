import React from 'react'
import { Root, Routes, ErrorBoundary, Suspense } from 'react-static'
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
        <Suspense>
          <Routes />
        </Suspense>
      </div>
    </Root>
  </ErrorBoundary>
)

export default App
