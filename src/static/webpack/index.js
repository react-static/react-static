/* eslint-disable import/no-dynamic-require, react/no-danger, import/no-mutable-exports */
import webpack from 'webpack'
import path from 'path'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import chalk from 'chalk'
import WebpackDevServer from 'webpack-dev-server'
import io from 'socket.io'
import fs from 'fs-extra'
// import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
//
import { getStagedRules } from './rules'
import { findAvailablePort, time, timeEnd } from '../../utils'
import { cleanPath, getPluginHooks } from '../../utils/shared'
import { prepareRoutes } from '..'

let resolvedReloadRoutes
let reloadWebpackRoutes

let devServer

const reloadRoutes = (...args) => {
  if (!resolvedReloadRoutes) {
    // Not ready yet, so just wait
    return
  }
  resolvedReloadRoutes(...args)
}

export { reloadRoutes }

// Builds a compiler using a stage preset, then allows extension via
// webpackConfigurator
export function webpackConfig({ config, stage }) {
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

  const transformers = getPluginHooks(config.plugins, 'webpack').concat(config.webpack || []).reduce(
    (all, curr) => {
      if (Array.isArray(curr)) {
        return [...all, ...curr]
      }
      return [...all, curr]
    },
    []
  );

  transformers.forEach(transformer => {
    if (typeof transformer === 'function') {
      const modifiedConfig = transformer(webpackConfig, {
        stage,
        defaultLoaders,
      })

      if (modifiedConfig) {
        webpackConfig = modifiedConfig
      }
    }
  })

  return webpackConfig
}

export async function buildCompiler({ config, stage }) {
  return webpack(webpackConfig({ config, stage }))
}

// Starts the development server
export async function startDevServer({ config }) {
  if (devServer) {
    return devServer
  }

  const devCompiler = await buildCompiler({ config, stage: 'dev' })

  // Default to localhost:3000, or use a custom combo if defined in static.config.js
  // or environment variables
  const intendedPort =
    (config.devServer && config.devServer.port) || process.env.PORT || 3000
  const port = await findAvailablePort(Number(intendedPort))
  // Find an available port for messages, as long as it's not the devServer port
  const messagePort = await findAvailablePort(4000, [port])
  if (intendedPort !== port) {
    time(
      chalk.red(
        `=> Warning! Port ${intendedPort} is not available. Using port ${chalk.green(
          intendedPort
        )} instead!`
      )
    )
  }
  const host =
    (config.devServer && config.devServer.host) ||
    process.env.HOST ||
    'http://localhost'

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
      ignored: 'node_modules',
      // ignored: new RegExp(`(node_modules|${config.paths.PAGES})`),
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
      reloadWebpackRoutes = config => {
        // Serve each routes data
        config.routes.forEach(({ path: routePath }) => {
          app.get(
            `/__react-static__/routeInfo/${encodeURI(
              routePath === '/' ? '' : routePath
            )}`,
            async (req, res, next) => {
              // Make sure we have the most up to date route from the config, not
              // an out of dat object.
              const route = config.routes.find(d => d.path === routePath)
              try {
                if (!route) {
                  throw new Error('Route could not be found!')
                }
                const allProps = route.getData
                  ? await route.getData({ route, dev: true })
                  : {}
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

      reloadWebpackRoutes(config)

      if (config.devServer && config.devServer.before) {
        config.devServer.before(app)
      }
    },
    port,
    host,
  }

  let first = true
  console.log('=> Building App Bundle...')
  time(chalk.green('=> [\u2713] Build Complete'))

  devCompiler.hooks.invalid.tap(
    {
      name: 'React-Static',
    },
    file => {
      console.log('=> File changed:', file.replace(config.paths.ROOT, ''))
      console.log('=> Updating build...')
      time(chalk.green('=> [\u2713] Build Updated'))
    }
  )

  devCompiler.hooks.done.tap(
    {
      name: 'React-Static',
    },
    stats => {
      const messages = formatWebpackMessages(stats.toJson({}, true))
      const isSuccessful = !messages.errors.length && !messages.warnings.length

      if (isSuccessful) {
        if (first) {
          timeEnd(chalk.green('=> [\u2713] Build Complete'))
          console.log(
            chalk.green('=> [\u2713] App serving at'),
            `${host}:${port}`
          )
        } else {
          timeEnd(chalk.green('=> [\u2713] Build Updated'))
        }
        if (first && config.onStart) {
          config.onStart({ devServerConfig })
        }
      }

      first = false

      if (messages.errors.length) {
        console.log(chalk.red('Failed to build! Fix any errors and try again!'))
        messages.errors.forEach(message => {
          console.log(message)
          console.log()
        })
      }

      if (messages.warnings.length) {
        console.log(chalk.yellow('Build complete with warnings.'))
        console.log()
        messages.warnings.forEach(message => {
          console.log(message)
          console.log()
        })
      }
    }
  )

  // Start the webpack dev server
  devServer = new WebpackDevServer(devCompiler, devServerConfig)

  // Start the messages socket
  const socket = io()
  socket.listen(messagePort)

  resolvedReloadRoutes = async paths => {
    await prepareRoutes(
      { config, opts: { dev: true }, silent: true },
      async config => {
        if (!paths) {
          paths = config.routes.map(route => route.path)
        }
        paths = paths.map(cleanPath)
        reloadWebpackRoutes(config)
        socket.emit('message', { type: 'reloadRoutes', paths })
      }
    )
  }

  await new Promise((resolve, reject) => {
    devServer.listen(port, null, err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })

  return devServer
}

export async function buildProductionBundles({ config }) {
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

      function checkBuildStats(stage, stageStats) {
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
              chalk.yellow(`
=> There were WARNINGS during the ${stage} build stage. Your site will still function, but you may achieve better performance by addressing the warnings above.
`)
            )
          }
        }
      }

      const prodStatsJson = prodStats.toJson()

      fs.outputFileSync(
        path.join(config.paths.TEMP, 'client-stats.json'),
        JSON.stringify(prodStatsJson, null, 2)
      )

      fs.outputFileSync(
        path.join(config.paths.TEMP, 'bundle-environment.json'),
        JSON.stringify(process.env, null, 2)
      )

      resolve(prodStatsJson)
    })
  })
}
