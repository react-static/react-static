import React from 'react'
import { Link } from 'react-router-dom'
//
import { GetRouteProps } from '../react-static'

export default GetRouteProps(
  ({ post }) =>
    (<div>
      <Link to="/blog">Back to Blog</Link>
      <h1>
        {post.title}
      </h1>
      <div>
        {post.body}
      </div>
    </div>),
  {
    loading: () => <span>Loading...</span>,
  },
)
