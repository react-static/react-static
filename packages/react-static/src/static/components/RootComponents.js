import React, { Component } from 'react'

export class DefaultDocument extends Component {
  render() {
    const { Html, Head, Body, children } = this.props
    return (
      <Html>
        <Head>
          <meta charSet="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=5, shrink-to-fit=no"
          />
        </Head>
        <Body>{children}</Body>
      </Html>
    )
  }
}

export const Html = ({ children, ...rest }) => (
  <html lang="en-US" {...rest}>
    {children}
  </html>
)
export const Head = ({ children, ...rest }) => <head {...rest}>{children}</head>
export const Body = ({ children, ...rest }) => <body {...rest}>{children}</body>
