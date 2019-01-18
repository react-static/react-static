import React from 'react'
import { withRouteData } from 'react-static'
import { Link } from '@reach/router'
import { Post } from '../types'

export default withRouteData(({ posts }: { posts: Post[] }) => (
  <div>
    <h1>It's blog time.</h1>
    <br />
    All Posts:
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <Link to={`/blog/post/${post.id}/`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  </div>
))
