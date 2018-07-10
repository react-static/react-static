import React, { Fragment } from 'react'
import { Router } from 'react-static'

import Routes from 'react-static-routes'

import './app.css'
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => (
  <Router>
    <Fragment>
      <Header />
      <main role="main" className="container">
        <Routes />
      </main>
      <Footer />
    </Fragment>
  </Router>
)

export default App
