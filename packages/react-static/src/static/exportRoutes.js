import OS from 'os'
import { fork } from 'child_process'
import chalk from 'chalk'

import { progress, time, timeEnd } from '../utils'
import fetchSiteData from './fetchSiteData'
import fetchRoutes from './fetchRoutes'
import plugins from './plugins'

const cores = Math.max(OS.cpus().length, 1)

export default (async function exportRoutes(state) {
  state = await fetchSiteData(state)
  state = await fetchRoutes(state)
  state = await buildHTML(state)
  state = await plugins.afterExport(state)
  return state
})

async function buildHTML(state) {
  const {
    routes,
    config: { paths, maxThreads },
  } = state

  time(chalk.green('[\u2713] HTML Exported'))

  // in case of an absolute path for DIST we must tell node to load the modules
  // from our project root
  if (!paths.DIST.startsWith(paths.ROOT)) {
    process.env.NODE_PATH = paths.NODE_MODULES
    require('module').Module._initPaths()
  }

  // Single threaded export
  if (maxThreads <= 1) {
    console.log('Exporting HTML...')
    await require('./exportRoutes.sync').default(state)
  } else {
    // Multi-threaded export
    const threads = Math.min(cores, maxThreads)
    const htmlProgress = progress(routes.length)

    console.log(`Exporting HTML across ${threads} threads...`)

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
            ...state,
            routes,
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

  timeEnd(chalk.green('[\u2713] HTML Exported'))

  return state
}
