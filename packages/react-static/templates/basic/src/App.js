import React from 'react'
import { Root, Routes, addPrefetchExcludes } from 'react-static'
//
import { Link } from 'components/Router'

import './app.css'

addPrefetchExcludes(['test'])

function App() {
  return (
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
  )
}

export default App
