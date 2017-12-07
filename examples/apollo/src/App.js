import React from 'react'
import { Router, Link } from 'react-static'
//
import Routes from 'react-static-routes'
//
import { ApolloProvider } from 'react-apollo'
import client from './connectors/apollo'

import './app.css'

export default () => (
  <ApolloProvider client={client}>
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
      </div>
    </Router>
  </ApolloProvider>
)
