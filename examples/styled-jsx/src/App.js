import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'
//

import './app.css'

export default () => (
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
      <style jsx global>
        {`
          nav {
            width: 100%;
            background: #108db8;
          }

          nav a {
            color: white;
            padding: 1rem;
            display: inline-block;
          }

          .content {
            padding: 1rem;
          }
        `}
      </style>
    </div>
  </Root>
)
