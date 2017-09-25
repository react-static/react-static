import React from 'react'
import { Router } from 'react-static'
import { Route, Switch, Redirect } from 'react-router-dom'
//
import Home from 'containers/Home'
import About from 'containers/About'
import Blog from 'containers/Blog'

export default () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      <Redirect to="/" />
    </Switch>
  </Router>
)
