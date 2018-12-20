import React from 'react'
import { Root, Routes } from 'react-static'
import { Link } from '@reach/router'
import { Provider } from 'react-redux'

//
import store from './connectors/redux'

import './app.css'

const App = () => (
  <Provider store={store}>
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
  </Provider>
)

export default App
