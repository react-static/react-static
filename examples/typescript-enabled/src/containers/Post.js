import React from 'react'
import { getRouteProps, Link } from 'react-static'
//

export default getRouteProps(({ post }) => (
  <div>
    <Link to="/blog/">{'<'} Back</Link>
    <br />
    <h3>{post.title}</h3>
    <p>{post.body}</p>
  </div>
))
