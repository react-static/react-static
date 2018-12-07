import React from 'react'
import { Link, RouteData } from 'react-static'
import { Container } from 'reactstrap'

const Footer = () => (
  <RouteData>
    {() => (
      <Container>
        <footer className="small">
          <div className="container">
            <div id="bottom-space" />
            <p className="float-right">
              <Link to="https://getmesh.io">getmesh.io</Link>
            </p>
          </div>
        </footer>
      </Container>
    )}
  </RouteData>
)

export default Footer
