import React from 'react'
import { withRouteData } from 'react-static'
import { Link } from '@reach/router'
//
import Typography from 'material-ui/Typography'

export default withRouteData(({ post }) => (
  <div>
    <Typography type="body1" component={Link} to="/blog" gutterBottom>
      {'<'} Back
    </Typography>
    <Typography type="title" gutterBottom>
      {post.title}
    </Typography>
    <Typography type="body1">{post.body}</Typography>
  </div>
))
