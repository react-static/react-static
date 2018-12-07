import React from 'react'
import { Root, Routes, Link } from 'react-static'

//

import './app.css'

const App = () => (
  <Root>
    <div>
      <nav>
        <Link exact to="/">
          Home
        </Link>
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
