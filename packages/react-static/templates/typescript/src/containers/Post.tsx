import React from 'react'
import { withRouteData } from 'react-static'
import { Link } from '@reach/router'
import { Post } from '../types'

export default withRouteData(({ post }: { post: Post }) => (
  <div>
    <Link to="/blog/">{'<'} Back</Link>
    <br />
    <h3>{post.title}</h3>
    <p>{post.body}</p>
  </div>
))
