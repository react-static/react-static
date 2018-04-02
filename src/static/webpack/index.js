/* eslint-disable import/no-dynamic-require, react/no-danger, import/no-mutable-exports */
import webpack from 'webpack'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import chalk from 'chalk'
import WebpackDevServer from 'webpack-dev-server'
import io from 'socket.io'
// import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
//
import { getStagedRules } from './rules'
import { findAvailablePort } from '../../utils'
import { cleanPath } from '../../utils/shared'
import { prepareRoutes } from '../'

let resolvedReloadRoutes
let reloadWebpackRoutes

const reloadRoutes = (...args) => {
  if (!resolvedReloadRoutes) {
    throw new Error('The client is not ready to receive data updates yet.')
  }
  resolvedReloadRoutes(...args)
}

export { reloadRoutes }

// Builds a compiler using a stage preset, then allows extension via
// webpackConfigurator
export function webpackConfig ({ config, stage }) {
  let webpackConfig
  if (stage === 'dev') {
    webpackConfig = require('./webpack.config.dev').default({ config })
  } else if (stage === 'prod') {
    webpackConfig = require('./webpack.config.prod').default({
      config,
    })
  } else if (stage === 'node') {
    webpackConfig = require('./webpack.config.prod').default({
      config,
      isNode: true,
    })
  } else {
    throw new Error('A stage is required when building a compiler.')
  }

  const defaultLoaders = getStagedRules({ config, stage })

  if (config.webpack) {
    let transformers = config.webpack
    if (!Array.isArray(config.webpack)) {
      transformers = [config.webpack]
    }

    transformers.forEach(transformer => {
      const modifiedConfig = transformer(webpackConfig, {
        stage,
        defaultLoaders,
      })
      if (modifiedConfig) {
        webpackConfig = modifiedConfig
      }
    })
  }
  return webpackConfig
}

export async function buildCompiler ({ config, stage }) {
  return webpack(webpackConfig({ config, stage }))
}

// Starts the development server
export async function startDevServer ({ config }) {
  const devCompiler = await buildCompiler({ config, stage: 'dev' })

  let first = true

  // Default to localhost:3000, or use a custom combo if defined in static.config.js
  // or environment variables
  const intendedPort = (config.devServer && config.devServer.port) || process.env.PORT || 3000
  const port = await findAvailablePort(Number(intendedPort))
  // Find an available port for messages, as long as it's not the devServer port
  const messagePort = await findAvailablePort(4000, [port])
  if (intendedPort !== port) {
    console.time(
      chalk.red(
        `=> Warning! Port ${intendedPort} is not available. Using port ${chalk.green(
          intendedPort
        )} instead!`
      )
    )
  }
  const host = (config.devServer && config.devServer.host) || process.env.HOST || 'http://localhost'

  const devServerConfig = {
    hot: true,
    disableHostCheck: true,
    contentBase: [config.paths.PUBLIC, config.paths.DIST],
    publicPath: '/',
    historyApiFallback: true,
    compress: false,
    quiet: true,
    ...config.devServer,
    watchOptions: {
      ignored: /node_modules/,
      ...(config.devServer ? config.devServer.watchOptions || {} : {}),
    },
    before: app => {
      // Serve the site data
      app.get('/__react-static__/getMessagePort', async (req, res) => {
        res.json({
          port: messagePort,
        })
      })

      app.get('/__react-static__/siteData', async (req, res, next) => {
        try {
          const siteData = await config.getSiteData({ dev: true })
          res.json(siteData)
        } catch (err) {
          res.status(500)
          res.json(err)
          next(err)
        }
      })

      // Since routes may change during dev, this function can rebuild all of the config
      // routes. It also references the original config when possible, to make sure it
      // uses any up to date getData callback generated from new or replacement routes.
      reloadWebpackRoutes = () => {
        // Serve each routes data
        config.routes.forEach(({ path: routePath }) => {
          app.get(
            `/__react-static__/routeInfo/${encodeURI(routePath === '/' ? '' : routePath)}`,
            async (req, res, next) => {
              // Make sure we have the most up to date route from the config, not
              // an out of dat object.
              const route = config.routes.find(d => d.path === routePath)
              try {
                const allProps = route.getData ? await route.getData({ dev: true }) : {}
                res.json({
                  ...route,
                  allProps,
                })
              } catch (err) {
                res.status(500)
                next(err)
              }
            }
          )
        })
      }

      reloadWebpackRoutes()

      if (config.devServer && config.devServer.before) {
        config.devServer.before(app)
      }
    },
    port,
    host,
  }

  const timefix = 11000
  devCompiler.plugin('watch-run', (watching, callback) => {
    watching.startTime += timefix
    callback()
  })

  devCompiler.plugin('invalid', () => {
    console.time(chalk.green('=> [\u2713] Build Complete'))
    console.log('=> Rebuilding...')
  })

  devCompiler.plugin('done', stats => {
    const messages = formatWebpackMessages(stats.toJson({}, true))
    const isSuccessful = !messages.errors.length && !messages.warnings.length

    if (isSuccessful) {
      console.timeEnd(chalk.green('=> [\u2713] Build Complete'))
      if (first) {
        first = false
        console.log(chalk.green('=> [\u2713] App serving at'), `${host}:${port}`)
        stats.startTime -= timefix
        if (config.onStart) {
          config.onStart({ devServerConfig })
        }
      }
    }

    if (messages.errors.length) {
      console.log(chalk.red('Failed to build! Fix any errors and try again!'))
      messages.errors.forEach(message => {
        console.log(message)
        console.log()
      })
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

  console.log('=> Building App Bundle...')
  console.time(chalk.green('=> [\u2713] Build Complete'))

  const devServer = new WebpackDevServer(devCompiler, devServerConfig)

  const socket = io()
  resolvedReloadRoutes = async paths => {
    await prepareRoutes(config, { dev: true })
    if (!paths) {
      paths = config.routes.map(route => route.path)
    }
    paths = paths.map(cleanPath)
    reloadWebpackRoutes()
    socket.emit('message', { type: 'reloadRoutes', paths })
  }

  socket.listen(messagePort)

  return new Promise((resolve, reject) => {
    devServer.listen(port, err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

export async function buildProductionBundles ({ config }) {
  return new Promise((resolve, reject) => {
    webpack([
      webpackConfig({ config, stage: 'prod' }),
      webpackConfig({ config, stage: 'node' }),
    ]).run((err, stats) => {
      if (err) {
        console.log(chalk.red(err.stack || err))
        if (err.details) {
          console.log(chalk.red(err.details))
        }
        return reject(err)
      }

      stats.toJson('verbose')

      const [prodStats, nodeStats] = stats.stats

      checkBuildStats('prod', prodStats)
      checkBuildStats('node', nodeStats)

      function checkBuildStats (stage, stageStats) {
        const buildErrors = stageStats.hasErrors()
        const buildWarnings = stageStats.hasWarnings()

        if (buildErrors || buildWarnings) {
          console.log(
            stageStats.toString({
              context: config.context,
              performance: false,
              hash: false,
              timings: true,
              entrypoints: false,
              chunkOrigins: false,
              chunkModules: false,
              colors: true,
            })
          )
          if (buildErrors) {
            console.log(
              chalk.red.bold(`
                => There were ERRORS during the ${stage} build stage! :(
                => Fix them and try again!
              `)
            )
          } else if (buildWarnings) {
            console.log(
              chalk.yellow.bold(`
                => There were WARNINGS during the ${stage} build stage!
              `)
            )
          }
        }
      }

      resolve(prodStats.toJson())
    })
  })
}
