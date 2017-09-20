import React, { Component } from 'react'

export default class Html extends Component {
  render () {
    const { children, scripts } = this.props
    return (
      <html lang="en-US">
        <head>
          <title>React Static Starter</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          {children}
          {scripts}
        </body>
      </html>
    )
  }
}
