import React from 'react'
import { getRouteProps, Link } from 'react-static'
//
import Typography from 'material-ui/Typography'


export default getRouteProps(({ post }) => (
  <div>
    <Typography type="body1" component={Link} to="/blog" gutterBottom>
      {'<'} Back
    </Typography>
    <Typography type="title" gutterBottom>
      {post.title}
    </Typography>
    <Typography type="body1">
      {post.body}
    </Typography>
  </div>
))
