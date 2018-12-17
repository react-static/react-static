import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'

//

import Navigation from './components/Navigation'
import withAuthentication from './session/withAuthentication'

import './app.css'

const App = withAuthentication(() => (
  <Root>
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
  </Root>
))

export default App
