
import React from 'react'
import { withRouteData, Link } from 'react-static'
//
import Typography from '@material-ui/core/Typography'


export default withRouteData(({ posts }) => (
  <div>
    <Typography type="headline" gutterBottom>
      It's blog time.
    </Typography>
    <Typography type="body1" component="div">
      All Posts:
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <Link to={`/blog/post/${post.id}/`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </Typography>
  </div>
))
