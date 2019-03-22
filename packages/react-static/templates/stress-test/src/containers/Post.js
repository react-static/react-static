import React from 'react'
import { useRouteData } from 'react-static'
import { Link } from '@reach/router'
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

export default () => {
  const { post } = useRouteData()
  return (
    <Post>
      <Link to="/blog/">{'<'} Back</Link>
      <br />
      <h3>{post.title}</h3>
      <p>{post.body}</p>
    </Post>
  )
}
