import React from 'react'
import { Router, Link } from 'react-static'
import { hot } from 'react-hot-loader'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
//
import Routes from 'react-static-routes'

import './app.css'

const App = () => (
  <Router>
    <div className="container">
      <h2>Gentics Mesh Demo <small><a href="https://getmesh.io">getmesh.io</a></small></h2>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <a href="/">Home</a>
          </Navbar.Brand>
        </Navbar.Header>
        <Nav>
          <NavItem eventKey={1} href="/automobiles">Automobiles</NavItem>
          <NavItem eventKey={2} href="/yachts">Yachts</NavItem>
          <NavItem eventKey={3} href="/aircraft">Aircraft</NavItem>
          <NavItem eventKey={4} href="/blog">Blog</NavItem>
        </Nav>
      </Navbar>
      <Routes />
    </div>
  </Router>
)

export default hot(module)(App)
