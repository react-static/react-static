import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'

//

import './app.css'

const App = () => (
  <Root>
    <div>
      <nav>
        <Link to="/">
          Home
        </Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/search">Search</Link>
      </nav>
      <div className="content">
        <Routes />
      </div>
    </div>
  </Root>
)

export default App
