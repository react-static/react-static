import React from 'react'
import { withSiteData } from 'react-static'
//
import logoImg from '../logo.png'

import { tac } from '../styles/utility.css'

export default withSiteData(() => (
  <div>
    <h1 style={tac}>Welcome to</h1>
    <img src={logoImg} alt="" />
  </div>
))
