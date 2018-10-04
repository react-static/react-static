import React from 'react'
import { withRouteData, Link } from 'react-static'
//
import Typography from '@material-ui/core/Typography'


export default withRouteData(({ post }) => (
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
