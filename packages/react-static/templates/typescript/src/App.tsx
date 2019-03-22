import React from 'react'
import { hot } from 'react-hot-loader'
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
      <div className="content">
        <FancyDiv>
          <Routes />
        </FancyDiv>
      </div>
    </Root>
  )
}

export default hot(App)
