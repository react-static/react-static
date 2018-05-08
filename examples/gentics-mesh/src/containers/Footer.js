import React from 'react'
import { Link, RouteData } from 'react-static'

const Footer = () => (
  <RouteData render={({node}) => (
    <footer className="container">
        <p>
          <small><Link to="https://getmesh.io">getmesh.io</Link></small>
        </p>
    </footer>
  )} />
)

export default Footer
