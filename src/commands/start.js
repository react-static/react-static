import React from 'react'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'
import { renderToStaticMarkup } from 'react-dom/server'
import WebpackConfigurator from 'webpack-configurator'
import express from 'express'
import cors from 'cors'
//
import { DIST, SRC } from '../paths'
import {
  getConfig,
  writeRouteComponentsToFile,
  findAvailablePort,
  copyPublicFolder,
} from '../static'
import DefaultHtml from '../DefaultHtml'
//
let first = true
let compiler

const config = getConfig()

async function startConfigServer () {
  // scan a range
  const port = await findAvailablePort(8000)
  process.env.STATIC_ENDPOINT = `http://127.0.0.1:${port}`

  const configApp = express()

  configApp.use(cors())

  configApp.get('/siteProps', async (req, res, next) => {
    try {
      const siteProps = await config.getSiteProps({ dev: true })
      res.json(siteProps)
    } catch (err) {
      res.status(500)
      next(err)
    }
  })

  configApp.get('/getRoutes', async (req, res, next) => {
    try {
      const routes = await config.getRoutes({ dev: true })

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

function buildCompiler ({ port }) {
  const webpackConfig = new WebpackConfigurator()

  const webpackConfigDev = require('../webpack/webpack.config.dev').default

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

function startDevServer ({ port }) {
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
  try {
    process.env.NODE_PATH = `${DIST}:${SRC}`
    require('module').Module._initPaths()
    const config = getConfig()
    await fs.remove(DIST)

    const port = await findAvailablePort(3000)

    const siteProps = await config.getSiteProps({ dev: true })

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
      <HtmlTemplate staticMeta={{}} Html={Html} Head={Head} Body={Body} siteProps={siteProps}>
        <div id="root" />
      </HtmlTemplate>,
    )

    await fs.outputFile(path.join(DIST, 'index.html'), html)

    console.log('=> Copying public directory...')
    console.time(chalk.green('=> [\u2713] Public directory copied'))
    copyPublicFolder(DIST)
    console.timeEnd(chalk.green('=> [\u2713] Public directory copied'))

    console.log('=> Building Routes...')
    console.time(chalk.green('=> [\u2713] Routes Built'))
    config.routes = await config.getRoutes({ dev: true })
    await writeRouteComponentsToFile(config.routes)
    console.timeEnd(chalk.green('=> [\u2713] Routes Built'))

    console.log('=> Building...')
    console.time(chalk.green('=> [\u2713] Build Complete'))
    await startConfigServer()
    buildCompiler({ port })
    startDevServer({ port })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
