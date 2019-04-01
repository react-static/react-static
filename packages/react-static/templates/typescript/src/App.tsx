import React from 'react'
import { hot } from 'react-hot-loader'
import { Root, Routes, ErrorBoundary } from 'react-static'
import { Link } from '@reach/router'
import './app.css'
import FancyDiv from '@components/FancyDiv'

function App() {
  return (
    <ErrorBoundary>
      <Root>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
        </nav>
        <div className="content">
          <React.Suspense fallback="Loading...">
            <FancyDiv>
              <Routes />
            </FancyDiv>
          </React.Suspense>
        </div>
      </Root>
    </ErrorBoundary>
  )
}

export default hot(App)
