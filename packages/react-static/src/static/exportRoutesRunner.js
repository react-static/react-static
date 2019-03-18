import OS from 'os'
import { fork } from 'child_process'
import chalk from 'chalk'

import { progress, time, timeEnd } from '../utils'
import fetchSiteData from './fetchSiteData'
import fetchRoutes from './fetchRoutes'

const cores = Math.max(OS.cpus().length, 1)

// Exporting route HTML and JSON happens here. It's a big one.
export default (async function exportRoutesRunner({
  config,
  clientStats,
  incremental,
}) {
  // we modify config in fetchSiteData
  const siteData = await fetchSiteData(config)
  // we modify config in fetchRoutes
  await fetchRoutes(config)

  await buildHTML({
    config,
    siteData,
    clientStats,
    incremental,
  })
})

async function buildHTML({
  config: oldConfig,
  siteData,
  clientStats,
  incremental,
}) {
  const { routes, ...config } = oldConfig
  time(chalk.green('=> [\u2713] HTML Exported'))

  // in case of an absolute path for DIST we must tell node to load the modules from our project root
  if (!config.paths.DIST.startsWith(config.paths.ROOT)) {
    process.env.NODE_PATH = config.paths.NODE_MODULES
    require('module').Module._initPaths()
  }

  // Single threaded export
  if (config.maxThreads <= 1) {
    console.log('=> Exporting HTML...')
    await require('./exportRoutes.sync').default({
      config,
      routes,
      siteData,
      clientStats,
      incremental,
    })
  } else {
    // Multi-threaded export
    const threads = Math.min(cores, config.maxThreads)
    const htmlProgress = progress(routes.length)
    console.log(`=> Exporting HTML across ${threads} threads...`)

    const exporters = []
    for (let i = 0; i < threads; i++) {
      exporters.push(
        fork(require.resolve('./exportRoutes.threaded'), [], {
          env: {
            ...process.env,
            REACT_STATIC_THREAD: 'true',
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
            incremental,
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
}
