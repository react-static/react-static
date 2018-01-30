import React from 'react'
import { getRouteData, Link } from 'react-static'
import { Post } from '../types'

interface Props {
  posts: Post[]
}

export default getRouteData(({ posts }: Props) => (
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
