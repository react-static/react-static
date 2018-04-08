import React from 'react'
import { withSiteData } from 'react-static'
import { Jumbotron, Row, Button } from 'react-bootstrap'

import logoSvg from '../gentics-mesh-logo.svg'

export default withSiteData(() => (
  <Jumbotron>
    <Row>
      <div className="col-sm-3 text-right">
        <img className="logo" src={logoSvg} alt="GENTICS Mesh" />
      </div>

      <div className="col-sm-9">
        <h1>GENTICS Mesh Demo Application</h1>
        <p>This is a basic demonstration of how to build a React application using <a href="https://getmesh.io">GENTICS
          Mesh</a> and <a href="https://react-static.js.org/">React Static</a>.</p>
        <p>The source code for this example can be found on <a
            href="https://github.com/nozzle/react-static/tree/master/examples/gentics-mesh">GitHub</a>.</p>

        <p><Button bsStyle="warning" bsSize="large" href="http://getmesh.io/docs/beta/getting-started.html">Would You Like to Know More?</Button></p>
      </div>
    </Row>
  </Jumbotron>
))
