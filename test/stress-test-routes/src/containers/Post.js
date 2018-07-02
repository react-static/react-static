import React from 'react'
import { withRouteData, Link } from 'react-static'
import styled from 'styled-components'
//

const Post = styled.div`
  h3 {
    font-weight: bold;
  }
`

export default withRouteData(({ post }) => (
  <Post>
    <Link to="/blog/">{'<'} Back</Link>
    <br />
    <h3>{post.title}</h3>
    <p>{post.body}</p>
  </Post>
))
