import React from 'react'
import { withSiteData } from 'react-static'
import { Jumbotron, Row, Button } from 'react-bootstrap'

import logoSvg from '../gentics-mesh-logo.svg'

export default withSiteData(() => (
  <Jumbotron>
    <Row>
      <div className="col-sm-3 text-right">
        <img className="logo" src={logoSvg} alt="Gentics Mesh" />
      </div>

      <div className="col-sm-9">
        <h1>Gentics Mesh Demo Application</h1>
        <p>This is a basic demonstration of how to build a React application using <a href="https://getmesh.io">Gentics
          Mesh</a> and <a href="https://react-static.js.org/">React Static</a>.</p>

        <p>These are some of Gentics Mesh features that this example demonstrates:</p>
        <p>
          <dl>
            <dt><a href="https://getmesh.io/docs/beta/features.html#contenttree">Content-node tree</a></dt>
            <dd>You can organize your content in terms of a content tree, or rather a content <strong>node</strong> tree. Content nodes can be hierarchically structured if a container schema is provided.</dd>
            <dt><a href="https://getmesh.io/docs/beta/features.html#prettyurls">Pretty URLs</a></dt>
            <dd>Instead of relying on UUIDs to link your content, you can use pretty URLs like <code>https://yourapp.com/automobiles/ford-gt/</code>. For each node, Gentics Mesh will provide you with a human readable path.</dd>
            <dt><a href="https://getmesh.io/docs/beta/features.html#navigation">Navigation Menus</a></dt>
            <dd>When organizing your content in terms of a content node tree, Gentics Mesh offers you a way of generating your front-end navigation dynamically by querying the available navigation endpoints.</dd>
            <dt><a href="https://getmesh.io/docs/beta/features.html#_breadcrumbs">Breadcrumbs</a></dt>
            <dd>Each node in Gentics Mesh provides information on where it is located within the node tree in terms of its <code>breadcrumb</code> property. The property provides an array of node references representing the path from the current node up to the project root.</dd>
          </dl>
        </p>
        <p>The source code for this example can be found on <a
          href="https://github.com/nozzle/react-static/tree/master/examples/gentics-mesh">GitHub</a>.</p>
        <p><Button bsStyle="warning" bsSize="large" href="http://getmesh.io/docs/beta/getting-started.html">Would You Like to Know More?</Button></p>
      </div>
    </Row>
  </Jumbotron>
))
