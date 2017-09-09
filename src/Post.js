import React from 'react'
import { Link } from 'react-router-dom'
// import styled, { css, keyframes } from 'styled-components'
//
import { GetRouteProps, MakeRouteProps } from '../react-static'

const getPostBySlug = async slug => {
  const post = await Promise.resolve({
    title: `${slug}!`,
    body: `Well hello there ${slug}!`,
  })
  return post
}

export default GetRouteProps(async ({ match }) => {
  const post = await getPostBySlug(match.params.slug)
  return {
    post,
  }
})(
  ({ post = {} }) =>
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
