
import React from 'react'
import { getRouteData, Link } from 'react-static'
//

export default getRouteData(({ posts }) => (
  <div>
    <h1>It’s blog time.</h1>
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
