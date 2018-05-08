import React, { Fragment } from 'react'
import { Router } from 'react-static'
import { hot } from 'react-hot-loader'
import Routes from 'react-static-routes'

import './app.css'
import Header from './containers/Header'
import Footer from './containers/Footer'

const App = () => (
  <Router>
    <Fragment>
      <Header />
      <div className="content">
        <Routes />
      </div>
      <Footer />
    </Fragment>
  </Router>
)

export default hot(module)(App)
