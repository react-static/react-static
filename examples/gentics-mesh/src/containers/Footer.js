import React from 'react'
import { Link, RouteData } from 'react-static'

const Footer = () => (
  <RouteData render={({ node }) => (
    <div>
      <div className="footer">
        <div className="footer-container">
          <p><small><Link to="https://getmesh.io">getmesh.io</Link></small></p>
        </div>
      </div>
    </div>
  )} />
)

export default Footer
