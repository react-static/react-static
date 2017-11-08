import React, { Component } from 'react'
import { ServerStyleSheet } from 'styled-components'
import { execSync } from 'child_process'
import WriteFilePlugin from 'write-file-webpack-plugin'
import path from 'path'

export default {
  paths: {
    dist: 'www',
  },
  renderToHtml: (render, Comp, meta) => {
    const sheet = new ServerStyleSheet()
    const html = render(sheet.collectStyles(<Comp />))
    meta.styleTags = sheet.getStyleElement()
    return html
  },
  Document: class CustomHtml extends Component {
    render () {
      const { Html, Head, Body, children, renderMeta } = this.props

      return (
        <Html>
          <Head>
            <meta name="format-detection" content="telephone=no" />
            <meta name="msapplication-tap-highlight" content="no" />
            <meta
              name="viewport"
              content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width"
            />
            <title>Hello World</title>
            {renderMeta.styleTags}
          </Head>
          <Body>
            {children}
            <script type="text/javascript" src="cordova.js" />
          </Body>
        </Html>
      )
    }
  },
  devServer: {
    contentBase: path.resolve(__dirname, './platforms/ios/www/'),
    watchOptions: {
      ignored: [/node_modules/, `${path.resolve(__dirname, './www')}/**`],
    },
  },
  webpack: (config, { stage }) => {
    if (stage === 'dev') {
      config.plugins.push(new WriteFilePlugin())
    }
    return config
  },
  onStart: ({ devServerConfig }) => {
    execSync('cordova run', { stdio: [null, null, 2] })
  },
}
