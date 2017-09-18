import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
//

import Home from './Home'
import Blog from './Blog'
import Post from './Post'

let Router = BrowserRouter

// If statically rendering, use the static router
if (process.env.IS_STATIC === 'true') {
  Router = require('react-router').StaticRouter
}

export default ({ URL, context }) =>
  (<Router location={URL} context={context}>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={Post} />
      <Redirect to="/" />
    </Switch>
  </Router>)
