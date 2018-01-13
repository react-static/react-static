import React from 'react'
import { getSiteProps } from 'react-static'
//
import Typography from 'material-ui/Typography'
import logoImg from '../logo.png'

export default getSiteProps(() => (
  <div>
    <Typography type="headline" align="center" gutterBottom>
      Welcome to
    </Typography>
    <img src={logoImg} alt="" />
  </div>
))
