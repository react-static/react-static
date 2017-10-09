import React from 'react'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { renderToStaticMarkup } from 'react-dom/server'
import WebpackConfigurator from 'webpack-configurator'
import findPort from 'find-port'
import express from 'express'
import cors from 'cors'
//
import DefaultHtml from '../DefaultHtml'
import copyPublicFolder from '../copyPublicFolder'
import { getConfig, normalizeRoutes } from '../static'
import { DIST } from '../paths'

const port = process.env.PORT || '3000'

let first = true
let compiler

const config = getConfig()

async function startConfigServer () {
  // scan a range
  const ports = await new Promise(resolve =>
    findPort('127.0.0.1', 8000, 8500, ports => {
      resolve(ports)
    }),
  )
  const port = ports[0]
  process.env.STATIC_ENDPOINT = `http://127.0.0.1:${port}`

  const configApp = express()

  configApp.use(cors())

  configApp.get('/getRoutes', async (req, res, next) => {
    try {
      const routes = normalizeRoutes(await config.getRoutes({ dev: true }))

      routes.forEach(route => {
        configApp.get(`/route${route.path}`, async (req, res, next) => {
          try {
            const initialProps = await route.getProps({ dev: true })
            res.json(initialProps)
          } catch (err) {
            res.status(500)
            next(err)
          }
        })
      })

      res.json(routes)
    } catch (err) {
      res.status(500)
      next(err)
    }
  })

  configApp.listen(port, err => {
    if (err) {
      throw err
    }
  })
}

function buildCompiler () {
  const webpackConfig = new WebpackConfigurator()

  const webpackConfigDev = require('../webpack.config.dev').default

  webpackConfig.merge(webpackConfigDev)
  if (config.webpack) {
    config.webpack(webpackConfig, { dev: true })
  }
  const finalWebpackConfig = webpackConfig.resolve()

  compiler = webpack(finalWebpackConfig)

  compiler.plugin('invalid', () => {
    console.time(chalk.green('=> [\u2713] Build Complete'))
    console.log('=> Rebuilding...')
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

  const HtmlTemplate = config.Html || DefaultHtml

  const Html = ({ children, ...rest }) => (
    <html lang="en" {...rest}>
      {children}
    </html>
  )
  const Head = ({ children, ...rest }) => <head {...rest}>{children}</head>
  const Body = ({ children, ...rest }) => (
    <body {...rest}>
      {children}
      <script async src="/app.js" />
    </body>
  )

  const html = renderToStaticMarkup(
    <HtmlTemplate staticMeta={{}} Html={Html} Head={Head} Body={Body}>
      <div id="root" />
    </HtmlTemplate>,
  )

  await fs.outputFile(path.join(DIST, 'index.html'), html)

  console.log('=> Copying public directory...')
  console.time(chalk.green('=> [\u2713] Public directory copied'))
  copyPublicFolder(DIST)
  console.timeEnd(chalk.green('=> [\u2713] Public directory copied'))

  console.log('=> Building...')
  console.time(chalk.green('=> [\u2713] Build Complete'))
  await startConfigServer()
  buildCompiler()
  startDevServer()
}
