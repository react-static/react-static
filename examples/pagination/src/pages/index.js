import React from 'react'
import { Head } from 'react-static'
//
import logoImg from '../logo.png'

export default () => (
  <div>
    <Head>
      <title>Welcome to React Static!</title>
    </Head>
    <h1 style={{ textAlign: 'center' }}>Welcome to</h1>
    <img src={logoImg} alt="" style={{ display: 'block', margin: '0 auto' }} />
  </div>
)
