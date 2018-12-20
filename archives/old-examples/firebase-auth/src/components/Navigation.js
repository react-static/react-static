import React from 'react'
import PropTypes from 'prop-types'
import { Link } from '@reach/router'

const Navigation = (props, { authUser }) => (
  <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
)

Navigation.contextTypes = {
  authUser: PropTypes.object,
}

const NavigationAuth = () => (
  <ul>
    <li>
      <Link to="/dashboard">Dashboard</Link>
    </li>
    <li>
      <Link to="/account">Account</Link>
    </li>
    <li>
      <Link to="/signout">Sign Out</Link>
    </li>
  </ul>
)

const NavigationNonAuth = () => (
  <ul>
    <li>
      <Link to="/signin">Sign In</Link>
    </li>
  </ul>
)

export default Navigation
