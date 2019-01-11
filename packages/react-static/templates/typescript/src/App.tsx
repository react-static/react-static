import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'

import './app.css'
import FancyDiv from '@components/FancyDiv'

function App() {
  return (
    <Root>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <FancyDiv>
        <div className="content">
          <Routes />
        </div>
      </FancyDiv>
    </Root>
  )
}

export default App

// tslint:disable-next-line:no-implicit-dependencies
