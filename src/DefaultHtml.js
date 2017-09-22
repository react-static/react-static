import React, { Component } from 'react'

export default class CustomHtml extends Component {
  render () {
    const { Html, Head, Body, children } = this.props
    return (
      <Html lang="en-US">
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Body>{children}</Body>
      </Html>
    )
  }
}
