import React, { Component } from 'react'
import { ServerStyleSheet } from 'styled-components'
import { execSync } from 'child_process'
import WriteFilePlugin from 'write-file-webpack-plugin'
import path from 'path'
import fs from 'fs-extra'

const filePath = path.resolve('./config.xml')

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
    } else {
      config.output.publicPath = ''
    }
    return config
  },
  onStart: async () => {
    const cordovaConfig = await fs.readFile(filePath, 'utf8')
    const replacement = cordovaConfig.replace('src="index.html"', 'src="http://localhost:3000"')
    await fs.writeFile(filePath, replacement, 'utf8')
    execSync('cordova run', { stdio: [null, null, 2] })
  },
  onBuild: async () => {
    const cordovaConfig = await fs.readFile(filePath, 'utf8')
    const replacement = cordovaConfig.replace('src="http://localhost:3000"', 'src="index.html"')
    await fs.writeFile(filePath, replacement, 'utf8')
  },
}
