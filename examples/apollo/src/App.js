import React from 'react'
import { Root, Routes, Link } from 'react-static'

//

//
import { ApolloProvider } from 'react-apollo'
import client from './connectors/apollo'

import './app.css'

const App = () => (
  <ApolloProvider client={client}>
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
  </ApolloProvider>
)

export default App
