import React from 'react'
import { getSiteData } from 'react-static'
//
import logoImg from '../logo.png'

export default getSiteData(() => (
  <div>
    <h1 style={{ textAlign: 'center' }}>Welcome to</h1>
    <img src={logoImg} alt="" />
    <br />
    <p>This is a demo of a Cordova application built with React Static!</p>
  </div>
))
