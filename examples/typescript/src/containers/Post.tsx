import React from 'react'
import { getRouteProps, Link } from 'react-static'
import { Post } from '../types'

interface Props {
  post: Post
}

export default getRouteProps(({ post }: Props) => (
  <div>
    <Link to="/blog/">{'<'} Back</Link>
    <br />
    <h3>{post.title}</h3>
    <p>{post.body}</p>
  </div>
))
