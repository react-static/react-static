/* eslint-disable import/no-dynamic-require, react/no-danger */
import webpack from 'webpack'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import chalk from 'chalk'
import WebpackDevServer from 'webpack-dev-server'
// import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
//
import { getStagedRules } from './rules'
import { findAvailablePort } from '../utils'

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
  config.publicPath = webpackConfig.output.publicPath
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
    contentBase: config.paths.DIST,
    publicPath: '/',
    historyApiFallback: true,
    compress: false,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    ...config.devServer,
    before: app => {
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

      app.get('/__react-static__/routeInfo', async (req, res, next) => {
        try {
          const routes = await config.getRoutes({ dev: true })

          // Once all of the routes have been resolved, listen on individual
          // route endpoints
          routes.forEach(route => {
            app.get(`/__react-static__/route${encodeURI(route.path)}`, async (req, res, next) => {
              try {
                const initialProps = await route.getData({ dev: true })
                res.json(initialProps)
              } catch (err) {
                res.status(500)
                next(err)
              }
            })
          })

          const routeInfo = {}

          routes
            .filter(d => d.hasGetProps)
            .map(d => d.path)
            .forEach(d => {
              routeInfo[d] = true
            })

          res.json(routeInfo)
        } catch (err) {
          res.status(500)
          next(err)
        }
      })

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
        console.log(chalk.green('=> [\u2713] App serving at'), `${host}:${port}`)
        stats.startTime -= timefix
        if (config.onStart) {
          config.onStart({ devServerConfig })
        }
      }
    }

    if (messages.errors.length) {
      console.log(chalk.red(first ? 'Failed to build!' : 'Failed to rebuild.'))
      messages.errors.forEach(message => {
        console.log(message)
        console.log()
      })
      process.exit(1)
    }

    first = false

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
