import React from 'react'
import { Router as BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'

// Need to abstract
import Home from './Home'
import Blog from './Blog'
import Post from './Post'

let Router = BrowserRouter
let history
if (process.env.IS_STATIC === 'true') {
  Router = require('react-router').StaticRouter
} else {
  history = createBrowserHistory()
}

export default ({ URL, context = {} }) =>
  (<Router location={URL} context={context} history={history}>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={Post} />
      <Redirect to="/" />
    </Switch>
  </Router>)
