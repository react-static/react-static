import React from 'react'
import { withSiteData } from 'react-static'
//
import Typography from 'material-ui/Typography'

export default withSiteData(() => (
  <div>
    <Typography type="headline" align="center" gutterBottom>
      Welcome to
    </Typography>
  </div>
))
