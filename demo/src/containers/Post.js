import React from 'react'
import { Link } from 'react-router-dom'
import { getRouteProps } from 'react-static'
//

export default getRouteProps(({ match, post }) => (
  <div>
    <Link to="/blog">{'<'} All Posts</Link>
    <br />
    <h3>{post.title}</h3>
    <p>{post.body}</p>
  </div>
))
