import OS from 'os'
import { fork } from 'child_process'
import chalk from 'chalk'
import { progress, time, timeEnd } from '../utils'
import exporter from './exporter'

const cores = Math.max(OS.cpus().length, 1)

export default (async function buildHTML({
  config: oldConfig,
  siteData,
  clientStats,
}) {
  const { routes, ...config } = oldConfig
  time(chalk.green('=> [\u2713] HTML Exported'))

  // in case of an absolute path for DIST we must tell node to load the modules from our project root
  if (config.paths.DIST.indexOf(config.paths.ROOT) !== 0) {
    process.env.NODE_PATH = config.paths.NODE_MODULES
    require('module').Module._initPaths()
  }

  // Single threaded export
  if (config.maxThreads <= 1) {
    console.log('=> Exporting HTML...')
    await exporter({
      config,
      routes,
      siteData,
      clientStats,
    })
  } else {
    // Multi-threaded export
    const threads = Math.min(cores, config.maxThreads)
    const htmlProgress = progress(routes.length)
    console.log(`=> Exporting HTML across ${cores} threads...`)

    const exporters = []
    for (let i = 0; i < threads; i++) {
      exporters.push(
        fork(require.resolve('./exporter.threaded'), [], {
          env: {
            ...process.env,
            REACT_STATIC_SLAVE: 'true',
          },
          stdio: 'inherit',
        })
      )
    }

    const exporterRoutes = exporters.map(() => [])

    routes.forEach((route, i) => {
      exporterRoutes[i % exporterRoutes.length].push(route)
    })

    await Promise.all(
      exporters.map((exporter, i) => {
        const routes = exporterRoutes[i]
        return new Promise((resolve, reject) => {
          exporter.send({
            config,
            routes,
            siteData,
            clientStats,
          })
          exporter.on('message', ({ type, payload }) => {
            if (type === 'error') {
              reject(payload)
            }
            if (type === 'log') {
              console.log(...payload)
            }
            if (type === 'tick') {
              htmlProgress.tick()
            }
            if (type === 'done') {
              resolve()
            }
          })
        })
      })
    )
  }

  timeEnd(chalk.green('=> [\u2713] HTML Exported'))
})
