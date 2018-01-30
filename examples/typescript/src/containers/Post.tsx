import React from 'react'
import { getRouteData, Link } from 'react-static'
import { Post } from '../types'

interface Props {
  post: Post
}

export default getRouteData(({ post }: Props) => (
  <div>
    <Link to="/blog/">{'<'} Back</Link>
    <br />
    <h3>{post.title}</h3>
    <p>{post.body}</p>
  </div>
))
