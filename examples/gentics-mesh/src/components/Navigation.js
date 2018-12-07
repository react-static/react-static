import React from 'react'
import { Link } from 'react-static'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap'

export default () => (
  <Navbar>
    <NavbarBrand>
      <Link to="/">Gentics Mesh Demo</Link>
    </NavbarBrand>
    <Nav>
      <NavItem>
        <NavLink>
          <Link to="/automobiles">Automobiles</Link>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink>
          <Link to="/yachts">Yachts</Link>
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink>
          <Link to="/aircrafts">Aircraft</Link>
        </NavLink>
      </NavItem>
    </Nav>
  </Navbar>
)
