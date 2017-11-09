import React from 'react'
import { Router, Link, Route, Switch } from 'react-static'
import styled, { injectGlobal } from 'styled-components'
//
import Home from 'containers/Home'
import Geolocation from 'containers/Geolocation'
import NotFound from 'containers/404'

injectGlobal`
  body {
    font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial,
      'Lucida Grande', sans-serif;
    font-weight: 300;
    font-size: 16px;
    margin: 0;
    padding: 0;
  }
`

const AppStyles = styled.div`
  a {
    text-decoration: none;
    color: #108db8;
    font-weight: bold;
  }

  nav {
    width: 100%;
    background: #108db8;
    padding-top: constant(safe-area-inset-top);

    a {
      color: white;
      padding: 1rem;
      display: inline-block;
    }
  }

  .content {
    padding: 1rem;
  }

  img {
    max-width: 100%;
  }
`

export default () => (
  <Router type="hash">
    <AppStyles>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/geolocation">Geolocation</Link>
      </nav>
      <div className="content">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/geolocation" component={Geolocation} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </AppStyles>
  </Router>
)
