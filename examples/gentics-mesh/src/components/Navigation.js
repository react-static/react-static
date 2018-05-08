import React from 'react'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import { RouteData } from 'react-static'

export default () => (
  <RouteData render={() => (
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">Gentics Mesh Demo</a>
        </Navbar.Brand>
      </Navbar.Header>
      <Nav>
        <NavItem eventKey={1} href="/automobiles">Automobiles</NavItem>
        <NavItem eventKey={2} href="/yachts">Yachts</NavItem>
        <NavItem eventKey={3} href="/aircrafts">Aircraft</NavItem>
      </Nav>
    </Navbar>
  )} />
)
