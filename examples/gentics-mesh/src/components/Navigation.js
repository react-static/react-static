import React from 'react'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'
import { RouteData } from 'react-static'

export default () => (
  <RouteData render={() => (
    <Navbar>
      <NavbarBrand href="/">Gentics Mesh Demo</NavbarBrand>
      <Nav>
        <NavItem>
          <NavLink href="/automobiles">Automobiles</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/yachts">Yachts</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="/aircrafts">Aircraft</NavLink>
        </NavItem>
      </Nav>
    </Navbar>
  )} />
)
