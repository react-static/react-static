import React, { Fragment } from 'react'
import { Link } from '@reach/router'
import { Jumbotron, Button, Container, Row, Col } from 'reactstrap'

import logoSvg from '../gentics-mesh-logo.svg'

const ProjectPage = () => (
  <Fragment>
    <Jumbotron>
      <Container>
        <Row>
          <Col md="2">
            <img
              className="logo"
              width="100px"
              src={logoSvg}
              alt="Gentics Mesh"
            />
          </Col>
          <Col md="10">
            <h1>Gentics Mesh Demo Application</h1>
            <p>
              This is a basic demonstration of how to build a React application
              using <Link to="https://getmesh.io">Gentics Mesh</Link> and{' '}
              <Link to="https://react-static.js.org/">React Static</Link>.
            </p>
            <p>
              The source code for this example can be found on{' '}
              <Link to="https://github.com/nozzle/react-static/tree/master/examples/gentics-mesh">
                GitHub
              </Link>
              .
            </p>
            <Button outline color="primary">
              <Link to="https://getmesh.io">Learn more...</Link>
            </Button>
          </Col>
        </Row>
      </Container>
    </Jumbotron>
    <Container>
      <Row>
        <Col md="3">
          <h2>Content-node tree</h2>
          <p>
            You can organize your content in terms of a content tree, or rather
            a content <strong>node</strong> tree. Content nodes can be
            hierarchically structured if a container schema is provided.
          </p>
          <p>
            <Button outline color="primary">
              <Link to="https://getmesh.io/docs/beta/features.html#contenttree">
                Learn more...
              </Link>
            </Button>
          </p>
        </Col>
        <Col md="3">
          <h2>Navigation Menus</h2>
          <p>
            When organizing your content in terms of a content node tree,
            Gentics Mesh offers you a way of generating your front-end
            navigation dynamically by querying the available navigation
            endpoints.
          </p>
          <p>
            <Button outline color="primary">
              <Link to="https://getmesh.io/docs/beta/features.html#navigation">
                Learn more...
              </Link>
            </Button>
          </p>
        </Col>
        <Col md="3">
          <h2>Pretty URLs</h2>
          <p>
            Instead of relying on UUIDs to link your content, you can use pretty
            URLs like <code>https://yourapp.com/automobiles/ford-gt/</code>. For
            each node, Gentics Mesh will provide you with a human readable path.
          </p>
          <p>
            <Button outline color="primary">
              <Link to="https://getmesh.io/docs/beta/features.html#prettyurls">
                Learn more...
              </Link>
            </Button>
          </p>
        </Col>
        <Col md="3">
          <h2>Breadcrumbs</h2>
          <p>
            Each node in Gentics Mesh provides information on where it is
            located within the node tree in terms of its <code>breadcrumb</code>{' '}
            property. The property provides an array of node references
            representing the path from the current node up to the project root.
          </p>
          <p>
            <Button outline color="primary">
              <Link to="https://getmesh.io/docs/beta/features.html#_breadcrumbs">
                Learn more...
              </Link>
            </Button>
          </p>
        </Col>
      </Row>
    </Container>
  </Fragment>
)

export default ProjectPage
