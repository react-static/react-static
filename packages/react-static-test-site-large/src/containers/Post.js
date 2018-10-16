import React from 'react'
import { withRouteData, Link } from 'react-static'

//

let styled

if (process.env.STYLE_SYSTEM === 'emotion') {
  styled = require('react-emotion').default
} else if (process.env.STYLE_SYSTEM === 'styled') {
  styled = require('styled-components').default
}

const Post = styled
  ? styled('div')`
      h3 {
        font-weight: bold;
      }
    `
  : props => <div {...props} />

export default withRouteData(({ post }) => (
  <Post>
    <Link to="/blog/">{'<'} Back</Link>
    <br />
    <h3>{post.title}</h3>
    <p>{post.body}</p>
  </Post>
))
