/* eslint-disable import/no-dynamic-require, react/no-danger */
import webpack from 'webpack'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import chalk from 'chalk'
import WebpackDevServer from 'webpack-dev-server'
// import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware'
//
import { DIST } from './paths'
import { getStagedRules } from './webpack/rules'
import { findAvailablePort } from './utils'


// Builds a compiler using a stage preset, then allows extension via
// webpackConfigurator
export function webpackConfig ({ config, stage }) {
  let webpackConfig
  if (stage === 'dev') {
    webpackConfig = require('./webpack/webpack.config.dev').default({ config })
  } else if (stage === 'prod') {
    webpackConfig = require('./webpack/webpack.config.prod').default({
      config,
    })
  } else if (stage === 'node') {
    webpackConfig = require('./webpack/webpack.config.prod').default({
      config,
      isNode: true,
    })
  } else {
    throw new Error('A stage is required when building a compiler.')
  }

  const defaultLoaders = getStagedRules({ stage })

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

  // Define the port to use
  let port = await findAvailablePort(3000)
  if (config.devServer && config.devServer.port) {
    port = config.devServer.port
  }
  if (process.env.PORT) {
    port = process.env.PORT
  }

  // Default to localhost, use a custom host if it is defined in static.config.js
  let host = 'http://localhost'
  if (config.devServer && config.devServer.host) {
    host = config.devServer.host
  }

  /**
   * Corbin Matschull (cgmx) - basedjux@gmail.com
   * Nov 6, 2017
   *
   * HOTFIX FOR ISSUE #124
   * This fix is from: https://github.com/nozzle/react-static/issues/124#issuecomment-342008635
   *
   * This implements a watcher when webpack runs to assign the timefix to {startTime}-
   * -and run the callback.
   *
   * After the devCompiler finishes it removes the timefix by-
   * subtracting {timefix} from {startTime}
   */

  // Move startTime from Modulo 10s
  const timefix = 11000
  devCompiler.plugin('watch-run', (watching, callback) => {
    watching.startTime += timefix
    callback()
  })
  // ================== PER HOTFIX #124 ==================


  devCompiler.plugin('invalid', () => {
    console.time(chalk.green('=> [\u2713] Build Complete'))
    console.log('=> Rebuilding...')
  })

  devCompiler.plugin('done', stats => {
    const messages = formatWebpackMessages(stats.toJson({}, true))
    const isSuccessful = !messages.errors.length && !messages.warnings.length

    if (isSuccessful) {
      console.timeEnd(chalk.green('=> [\u2713] Build Complete'))
    }

    if (first) {
      first = false
      console.log(
        chalk.green('=> [\u2713] App serving at'),
        `${host}:${port}`,
      )

      //  Corbin Matchull (cgmx) - basedjux@gmail.com
      //  Nov 6, 2017
      //  Move the startTime back to before {timefix}
      stats.startTime -= timefix
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

  console.log('=> Building App Bundle...')
  console.time(chalk.green('=> [\u2713] Build Complete'))
  const defaultDevServerConfig = {
    port,
    host,
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
  }
  const devServerConfig = Object.assign(defaultDevServerConfig, config.devServer)
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
  const build = (stage, compiler) =>
    new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          console.log(chalk.red(err.stack || err))
          if (err.details) {
            console.log(chalk.red(err.details))
          }
          return reject(err)
        }

        stats.toJson('verbose')

        const buildErrors = stats.hasErrors()
        const buildWarnings = stats.hasWarnings()

        if (buildErrors || buildWarnings) {
          console.log(
            stats.toString({
              context: config.context,
              performance: false,
              hash: false,
              timings: true,
              entrypoints: false,
              chunkOrigins: false,
              chunkModules: false,
              colors: true,
            }),
          )
          if (buildErrors) {
            console.log(
              chalk.red.bold(
                `
=> There were ERRORS during the ${stage} build stage! :(
=> Fix them and try again!`,
              ),
            )
          } else if (buildWarnings) {
            console.log(
              chalk.yellow.bold(
                `
=> There were WARNINGS during the ${stage} build stage!`,
              ),
            )
          }
        }

        resolve()
      })
    })

  const prodCompiler = await buildCompiler({
    config,
    stage: 'prod',
  })
  const nodeCompiler = await buildCompiler({
    config,
    stage: 'node',
  })

  await Promise.all([build('prod', prodCompiler), build('node', nodeCompiler)])
}
