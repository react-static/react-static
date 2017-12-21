import React, { Component } from 'react'
import logo from './logo.png'

import './app.css'

class App extends Component {
  render () {
    return (
      <div className="text-center">
        <header className="App-header bg-grey-light text-black p-1">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="text-2xl">Welcome to React-Static</h1>
        </header>
        <p className="text-lg">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    )
  }
}

export default App
