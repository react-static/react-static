import React, { Fragment } from 'react'
import { Root, Routes } from 'react-static'

//

import Header from './components/Header'

import './app.css'

const App = () => (
  <Root>
    <Fragment>
      <Header />
      <main>
        <Routes />
      </main>
    </Fragment>
  </Root>
)

export default App
