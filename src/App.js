import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router'
// Need to abstract
import { GetRouteProps } from '../react-static'

const getPostBySlug = async slug => {
  const post = await Promise.resolve({
    title: 'Hello world!',
    body: `Well hello there ${slug}!`,
  })
  return post
}

const Post2 = GetRouteProps(async ({ match }) => {
  const post = await getPostBySlug(match.params.slug)
  return {
    post,
  }
})(({ post = {} }) =>
  (<div>
    <h1>
      {post.title}
    </h1>
    <div>
      {post.body}
    </div>
  </div>),
)

const Post = GetRouteProps(async ({ match }) => {
  const post = await getPostBySlug(match.params.slug)
  return {
    post,
  }
})(({ post = {}, ...rest }) =>
  (<div>
    <h1>
      {post.title}
    </h1>
    <div>
      {post.body}
      <Post2 {...rest} />
    </div>
  </div>),
)

let Router = BrowserRouter

if (process.env.IS_SERVER === 'true') {
  Router = require('react-router').StaticRouter
}

export default ({ URL, context = {} }) =>
  (<Router location={URL} context={context}>
    <Switch>
      <Route exact path="/" component={() => <h1>Welcome Home!</h1>} />
      <Route exact path="/blog" component={() => <h1>Here is the blog.</h1>} />
      <Route path="/blog/:slug" component={Post} />
      <Redirect to="/" />
    </Switch>
  </Router>)
