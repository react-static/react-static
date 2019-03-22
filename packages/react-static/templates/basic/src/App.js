import React from 'react'
import { hot } from 'react-hot-loader/root'
import { Root, Routes, ErrorBoundary, Suspense } from 'react-static'
//
import { Link } from 'components/Router'

import './app.css'

function App() {
  return (
    <ErrorBoundary>
      <Root>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/">Home</Link>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/test">Test</Link>
        </nav>
        <div className="content">
          <Suspense fallback={<em>Loading...</em>}>
            <Routes />
          </Suspense>
        </div>
      </Root>
    </ErrorBoundary>
  )
}

export default hot(App)
