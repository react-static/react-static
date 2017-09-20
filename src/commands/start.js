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
import { DIST } from '../paths'

const port = process.env.PORT || '3000'

let first = true
let compiler

function buildCompiler () {
  compiler = webpack(webpackConfig)

  compiler.plugin('invalid', () => {
    console.log('=> Rebuilding...')
    console.time(chalk.green('=> [\u2713] Build Complete'))
  })

  compiler.plugin('done', stats => {
    const messages = formatWebpackMessages(stats.toJson({}, true))
    const isSuccessful = !messages.errors.length && !messages.warnings.length

    if (isSuccessful) {
      console.timeEnd(chalk.green('=> [\u2713] Build Complete'))
    }

    if (first) {
      first = false
      console.log(chalk.green('=> [\u2713] App serving at'), `http://localhost:${port}`)
    }

    if (messages.errors.length) {
      console.log(chalk.red('Failed to rebuild.'))
      messages.errors.forEach(message => {
        console.log(message)
        console.log()
      })
      return
    }

    if (messages.warnings.length) {
      console.log(chalk.yellow('Built complete with warnings.'))
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
    port,
    hot: true,
    disableHostCheck: true,
    contentBase: DIST,
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
  })
}

export default async () => {
  const config = getConfig()
  await fs.remove(DIST)

  const Html = config.Html

  const html = renderToStaticMarkup(
    <Html meta={{}} scripts={<script async src="/app.js" />}>
      <div id="root" />
    </Html>,
  )

  await fs.outputFile(path.join(DIST, 'index.html'), html)

  console.log('=> Copying public directory...')
  console.time(chalk.green('=> [\u2713] Public directory copied'))
  copyPublicFolder(DIST)
  console.timeEnd(chalk.green('=> [\u2713] Public directory copied'))

  console.log('=> Building...')
  console.time(chalk.green('=> [\u2713] Build Complete'))
  buildCompiler()
  startDevServer()
}
