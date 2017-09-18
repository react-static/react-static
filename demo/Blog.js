import React from 'react'
import { Link } from 'react-router-dom'
//
import { GetRouteProps } from '../react-static'

export default GetRouteProps(({ posts }) =>
  (<div>
    <Link to="/">Go Home</Link>
    <h1>The BLOG.</h1>
    <ul>
      {posts.map(post =>
        (<li key={post.title}>
          <Link to={`/blog/${post.title}`}>
            <h2>
              {post.title}
            </h2>
          </Link>
          <p>
            {post.body}
          </p>
        </li>),
      )}
    </ul>
  </div>),
)
