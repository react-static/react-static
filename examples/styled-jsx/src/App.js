import React from 'react'
import { Router, Link } from 'react-static'
//
import Routes from 'react-static-routes'

import './app.css'

export default () => (
  <Router>
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <div className="content">
        <Routes />
      </div>
      <style jsx global>{`
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
      `}</style>
    </div>
  </Router>
)
