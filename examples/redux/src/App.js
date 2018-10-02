import React from 'react'
import { Router, Routes, Link } from 'react-static'
import { Provider } from 'react-redux'

//
import store from './connectors/redux'

import './app.css'

const App = () => (
  <Provider store={store}>
    <Router>
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
    </Router>
  </Provider>
)

export default App
