/* eslint-disable import/no-dynamic-require, react/no-danger, import/no-mutable-exports */
import webpack from 'webpack'
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages'
import chalk from 'chalk'
import WebpackDevServer from 'webpack-dev-server'
import io from 'socket.io'
//
import getWebpackConfig from './getWebpackConfig'
import getRouteData from '../getRouteData'
import { findAvailablePort, time, timeEnd } from '../../utils'

let devServer
let buildDevRoutes = () => {}
let reloadClientData = () => {}

export { reloadClientData }

// Starts the development server
export default async function runDevServer(state) {
  // TODO check config.devServer for changes and notify user
  // if the server needs to be restarted for changes to take
  // effect.

  // If the server is already running, trigger a refresh to the client

  if (devServer) {
    await buildDevRoutes(state)
    await reloadClientData()
  } else {
    await makeDevServer(state)
  }

  return state
}

async function makeDevServer(state) {
  const devCompiler = webpack(getWebpackConfig(state))

  // Default to localhost:3000, or use a custom combo if defined in static.config.js
  // or environment variables
  const intendedPort =
    (state.config.devServer && state.config.devServer.port) ||
    process.env.PORT ||
    3000
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
    (state.config.devServer && state.config.devServer.host) ||
    process.env.HOST ||
    'http://localhost'

  const devServerConfig = {
    hot: true,
    disableHostCheck: true,
    contentBase: [state.config.paths.PUBLIC, state.config.paths.DIST],
    publicPath: '/',
    historyApiFallback: true,
    compress: false,
    quiet: true,
    ...state.config.devServer,
    watchOptions: {
      ignored: 'node_modules',
      ...(state.config.devServer
        ? state.config.devServer.watchOptions || {}
        : {}),
    },
    before: app => {
      // Serve the site data
      app.get('/__react-static__/getMessagePort', async (req, res) => {
        res.send({
          port: messagePort,
        })
      })

      // Since routes may change during dev, this function can rebuild all of the config
      // routes. It also references the original config when possible, to make sure it
      // uses any up to date getData callback generated from new or replacement routes.
      buildDevRoutes = latestState => {
        app.get('/__react-static__/siteData', async (req, res, next) => {
          try {
            res.send(latestState.siteData)
          } catch (err) {
            res.status(500)
            res.send(err)
            next(err)
          }
        })

        // Serve each routes data
        latestState.routes.forEach(({ path: routePath }) => {
          app.get(
            `/__react-static__/routeInfo/${encodeURI(
              routePath === '/' ? '' : routePath
            )}`,
            async (req, res, next) => {
              // Make sure we have the most up to date route from the config, not
              // an out of dat object.
              let route = latestState.routes.find(d => d.path === routePath)
              try {
                if (!route) {
                  throw new Error('Route could not be found!')
                }

                route = await getRouteData(route, latestState)

                // Don't use any hashProp, just pass all the data in dev
                res.json(route)
              } catch (err) {
                res.status(404)
                next(err)
              }
            }
          )
        })
      }

      buildDevRoutes(state)

      if (state.config.devServer && state.config.devServer.before) {
        state.config.devServer.before(app)
      }

      return app
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
      console.log('=> File changed:', file.replace(state.config.paths.ROOT, ''))
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
        if (first && state.config.onStart) {
          // TODO: turn this into a hook
          state.config.onStart({ devServerConfig })
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

  reloadClientData = () => {
    socket.emit('message', { type: 'reloadClientData' })
  }

  await new Promise((resolve, reject) => {
    devServer.listen(port, null, err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })

  // Make sure we start listening on the message port after the dev server.
  // We do this mostly to appease codesandbox.io, since they autobind to the first
  // port that opens up for their preview window.
  socket.listen(messagePort)

  return state
}
