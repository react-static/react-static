import React from 'react'
import { withSiteData } from 'react-static'
import { Card } from 'antd'
//
import logoImg from '../logo.png'

export default withSiteData(() => (
  <div>
    <Card title="Welcome to" style={{ width: '100%' }} bodyStyle={{ padding: 0 }}>
      <div className="custom-image">
        <img alt="react-static" width="100%" src={logoImg} />
      </div>
    </Card>
  </div>
))
