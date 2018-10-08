import React from 'react'
import { Router, Link, Routes } from 'react-static'
import { hot } from 'react-hot-loader'
//

import './app.css'

const App = () => (
  <Router>
    <div>
      <nav>
        <Link exact to="/">
          Home
        </Link>
        <Link to="/pages/about">About</Link>
        <Link to="/pages/blog">Blog</Link>
      </nav>
      <div className="content">
        <Routes />
      </div>
    </div>
  </Router>
)

export default hot(module)(App)
