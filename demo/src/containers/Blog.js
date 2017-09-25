import React from 'react'
import { Switch, Route, Link } from 'react-router-dom'
import { getRouteProps } from 'react-static'
//
import Post from './Post'

export default getRouteProps(({ match, posts }) => (
  <div>
    <Link to="/">Go home</Link>
    <br />
    <h1>It's blog time.</h1>
    <Switch>
      <Route
        path={match.url}
        exact
        render={() => (
          <div>
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
  </div>
))
