import React from 'react'
import { Link } from 'react-router-dom'
// import styled, { css, keyframes } from 'styled-components'
//

import { GetRouteProps } from '../react-static'

const getPosts = async () => {
  const posts = await Promise.resolve([
    {
      title: 'post1',
      body: 'Well hello there post1!',
    },
    {
      title: 'post2',
      body: 'Well hello there post2!',
    },
    {
      title: 'post3',
      body: 'Well hello there post3!',
    },
  ])
  return posts
}

export default GetRouteProps(async () => {
  const posts = await getPosts()
  return {
    posts,
  }
})(({ posts }) =>
  (<div>
    <Link to="/">Go Home</Link>
    <h1>The BLOG.</h1>
    <ul>
      {posts.map(post =>
        (<li key={post.title}>
          <h2>
            {post.title}
          </h2>
          <p>
            {post.body}
          </p>
        </li>),
      )}
    </ul>
  </div>),
)
