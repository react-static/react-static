import React from 'react'
import { withSiteData } from 'react-static'
//
import Typography from 'material-ui/Typography'
import logoImg from '../logo.png'

export default withSiteData(() => (
  <div>
    <Typography type="headline" align="center" gutterBottom>
      Welcome to
    </Typography>
    <img src={logoImg} alt="" style={{ display: 'block', margin: '0 auto' }} />
  </div>
))
