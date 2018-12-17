import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'
import { hot } from 'react-hot-loader'
//

import './app.css'

const App = () => (
  <Root>
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/pages/about">About</Link>
        <Link to="/pages/blog">Blog</Link>
      </nav>
      <div className="content">
        <Routes />
      </div>
    </div>
  </Root>
)

export default hot(module)(App)
