import React from 'react'
import { Router, Link } from 'react-static'
//
import Routes from 'react-static-routes'
import Navigation from './components/Navigation'
import withAuthentication from './session/withAuthentication'

import './app.css'

const App = () => (
  <Router>
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <Navigation />
      <div className="content">
        <Routes />
      </div>
    </div>
  </Router>
)

export default withAuthentication(App)
