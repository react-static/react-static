import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'

//

//
import { ApolloProvider } from 'react-apollo'
import { Provider } from 'react-redux'
import client from './connectors/apollo'
import store from './connectors/redux'

import './app.css'

const App = () => (
  <ApolloProvider client={client}>
    <Provider store={store}>
      <Root>
        <div>
          <nav>
            <Link to="/">
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
    </Provider>
  </ApolloProvider>
)

export default App
