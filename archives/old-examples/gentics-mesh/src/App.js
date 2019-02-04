import React, { Fragment } from 'react'
import { Root, Routes } from 'react-static'

import './app.css'
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => (
  <Root>
    <Fragment>
      <Header />
      <main role="main" className="container">
        <Routes />
      </main>
      <Footer />
    </Fragment>
  </Root>
)

export default App
