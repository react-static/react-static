import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'

// tslint:disable-next-line:no-implicit-dependencies

import './app.css'

const App = () => (
  <Root>
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <div className="content">
        <Routes />
      </div>
    </div>
  </Root>
)

export default App
