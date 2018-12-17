import React from 'react'
import { withRouteData } from 'react-static'
import { Link } from '@reach/router'
import convert from 'htmr'
//

export default withRouteData(({ post }) => (
  <div>
    <Link to="/blog/">{'<'} Back</Link>
    <br />
    <h3>{post.title}</h3>
    {convert(post.contents)}
  </div>
))
