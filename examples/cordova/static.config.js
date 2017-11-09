import React, { Component } from 'react'
import { ServerStyleSheet } from 'styled-components'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs-extra'

const filePath = path.resolve('./config.xml')

export default {
  paths: {
    dist: 'www', // Cordova loves it's triple dubs!
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
              content={`
                user-scalable=no,
                initial-scale=1,
                maximum-scale=1,
                minimum-scale=1,
                width=device-width,
                viewport-fit=cover
              `}
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
    // Serve from the ios build folder
    contentBase: path.resolve(__dirname, './platforms/ios/www/'),
  },
  webpack: (config, { stage }) => {
    if (stage !== 'dev') {
      // Cordova serves from file, so relative links, please.
      config.output.publicPath = ''
    }
    return config
  },
  onStart: async () => {
    // Replace content src with webpack dev server
    const cordovaConfig = await fs.readFile(filePath, 'utf8')
    const replacement = cordovaConfig.replace('src="index.html"', 'src="http://localhost:3000"')
    await fs.writeFile(filePath, replacement, 'utf8')
    execSync('cordova run', { stdio: [null, null, 2] })
  },
  onBuild: async () => {
    // Replace content src with index.html
    const cordovaConfig = await fs.readFile(filePath, 'utf8')
    const replacement = cordovaConfig.replace('src="http://localhost:3000"', 'src="index.html"')
    await fs.writeFile(filePath, replacement, 'utf8')
  },
}
