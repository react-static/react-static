import React from 'react'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { renderToStaticMarkup } from 'react-dom/server'
//

import webpackConfig from '../webpack.config.dev'
import copyPublicFolder from '../copyPublicFolder'
import { getConfig } from '../static'
import { TEMP } from '../paths'

const isInteractive = process.stdout.isTTY
const port = process.env.PORT || '3000'

let compiler

function buildCompiler () {
  compiler = webpack(webpackConfig)
  let isFirstCompile = true

  compiler.plugin('invalid', () => {
    console.log('Compiling...')
  })

  compiler.plugin('done', stats => {
    const messages = formatWebpackMessages(stats.toJson({}, true))
    const isSuccessful = !messages.errors.length && !messages.warnings.length
    const showInstructions = isSuccessful && (isInteractive || isFirstCompile)

    if (showInstructions) {
      console.log()
      console.log(
        chalk.green(`=>  [\u2713] Compile successful, the app is running at localhost:${port}`),
      )
      isFirstCompile = false
    }

    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'))
      messages.errors.forEach(message => {
        console.log(message)
        console.log()
      })
      return
    }

    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.'))
      console.log()
      messages.warnings.forEach(message => {
        console.log(message)
        console.log()
      })
    }
  })
}

function startDevServer () {
  const devServer = new WebpackDevServer(compiler, {
    hot: true,
    port,
    disableHostCheck: true,
    contentBase: TEMP,
    publicPath: '/',
    historyApiFallback: true,
    compress: true,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  })

  devServer.listen(port, err => {
    if (err) {
      return console.log(err)
    }

    console.log(chalk.green('=>  [\u2713] Development server starting...'))
  })
}

export default async () => {
  const config = getConfig()
  await fs.remove(TEMP)

  const Html = config.Html

  const html = renderToStaticMarkup(
    <Html meta={{}} scripts={<script async src="/app.js" />}>
      <div id="root" />
    </Html>,
  )

  await fs.outputFile(path.join(TEMP, 'index.html'), html)

  copyPublicFolder(TEMP)
  buildCompiler()
  startDevServer()
}
