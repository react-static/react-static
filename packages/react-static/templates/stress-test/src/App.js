import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'

import './app.css'

const App = () => (
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
)

export default App
