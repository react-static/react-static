/* eslint-disable react/no-unescaped-entities */
import React from 'react'
import { getRouteProps, Switch, Route, Link } from 'react-static'
//
import Post from './Post'

export default getRouteProps(({ match, posts }) => (
  <Switch>
    <Route
      path={match.url}
      exact
      render={() => (
        <div>
          <h1>It's blog time.</h1>
          <br />
          All Posts:
          <ul>
            {posts.map(post => (
              <li key={post.id}>
                <Link to={`/blog/post/${post.id}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    />
    <Route path={`${match.url}/post/:postID`} component={Post} />
  </Switch>
))
