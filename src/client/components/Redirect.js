import React from 'react'
import { Redirect as ReactRouterRedirect } from 'react-router-dom'
import Head from 'react-helmet'
//

export default class Redirect extends React.Component {
  render () {
    const {
      to, delay = 0, fromPath, ...rest
    } = this.props
    if (typeof document === 'undefined') {
      let resolvedTo = typeof to === 'object' ? to.pathname : to
      if (!resolvedTo.includes('//')) {
        resolvedTo = `${process.env.REACT_STATIC_PUBLIC_PATH}${
          resolvedTo === '/' ? '' : resolvedTo
        }`
      }
      return (
        // ReactRouterRedirect
        <Head>
          {fromPath && (
            <title>{`${process.env.REACT_STATIC_PUBLIC_PATH}${
              fromPath === '/' ? '' : fromPath
            }`}
            </title>
          )}
          <link rel="canonical" href={resolvedTo} />
          <meta name="robots" content="noindex" />
          <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
          <meta httpEquiv="refresh" content={`${delay}; url=${resolvedTo}`} />
        </Head>
      )
    }
    return <ReactRouterRedirect to={to} {...rest} />
  }
}
