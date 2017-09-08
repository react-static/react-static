import React from 'react'
// import styled, { css, keyframes } from 'styled-components'
//
import { GetRouteProps } from '../react-static'

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
})(({ post = {} }) =>
  (<div>
    <h1>
      {post.title}
    </h1>
    <div>
      {post.body}
    </div>
  </div>),
)
