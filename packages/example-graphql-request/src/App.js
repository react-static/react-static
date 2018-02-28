import React, { Fragment } from 'react'
import { Router } from 'react-static'
import { hot } from 'react-hot-loader'
//
import Routes from 'react-static-routes'
import Header from './components/Header'

import './app.css'

const App = () => (
  <Router>
    <Fragment>
      <Header />
      <main>
        <Routes />
      </main>
    </Fragment>
  </Router>
)

export default hot(module)(App)
