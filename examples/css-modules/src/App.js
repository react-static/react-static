import React from 'react'
import { Router, Link } from 'react-static'
import { hot } from 'react-hot-loader'
//
import Routes from 'react-static-routes'

import {
  content, nav, link,
} from './styles/index.css'

const App = () => (
  <Router>
    <div>
      <nav
        className={nav}
      >
        <Link className={link} to="/">Home</Link>
        <Link className={link} to="/about">About</Link>
        <Link className={link} to="/blog">Blog</Link>
      </nav>

      <div className={content}>
        <Routes />
      </div>
    </div>
  </Router>
)

export default hot(module)(App)
