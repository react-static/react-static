import React, { Fragment } from 'react'
import { Router } from 'react-static'

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

export default App
