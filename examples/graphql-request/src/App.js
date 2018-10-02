import React, { Fragment } from 'react'
import { Router, Routes } from 'react-static'

//

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
