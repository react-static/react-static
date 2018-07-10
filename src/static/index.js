/* eslint-disable import/no-dynamic-require, react/no-danger */

import fs from 'fs-extra'
import path from 'path'
import shorthash from 'shorthash'
import chalk from 'chalk'
import OS from 'os'
import { fork } from 'child_process'

import generateRoutes from './generateRoutes'
import getRoutes from './getRoutes'
import buildXMLandRSS from './buildXML'
import { progress, time, timeEnd } from '../utils'
import { poolAll } from '../utils/shared'
import exporter from './exporter'

export { buildXMLandRSS }

const cores = Math.max(OS.cpus().length, 1)

export const extractTemplates = async config => {
  console.log('=> Building Templates')
  time(chalk.green('=> [\u2713] Templates Built'))
  // Dedupe all templates into an array
  const templates = []

  config.routes.forEach(route => {
    if (!route.component) {
      return
    }
    // Check if the template has already been added
    const index = templates.indexOf(route.component)
    if (index === -1) {
      // If it's new, add it
      templates.push(route.component)
      // Assign the templateID
      route.templateID = templates.length - 1
    } else {
      // Assign the existing templateID
      route.templateID = index
    }
  })
  timeEnd(chalk.green('=> [\u2713] Templates Built'))

  config.templates = templates

  await generateRoutes({
    config,
  })

  return templates
}

export const prepareRoutes = async ({ config, opts }, cb = d => d) => {
  console.log('=> Building Routes...')
  // set the static routes
  process.env.REACT_STATIC_ROUTES_PATH = path.join(config.paths.DIST, 'react-static-routes.js')

  time(chalk.green('=> [\u2713] Routes Built'))
  return getRoutes(
    {
      config,
      opts,
    },
    async routes => {
      timeEnd(chalk.green('=> [\u2713] Routes Built'))
      config.routes = routes
      config.templates = extractTemplates(config)
      return cb(config)
    }
  )
}

export const fetchSiteData = async config => {
  console.log('=> Fetching Site Data...')
  time(chalk.green('=> [\u2713] Site Data Downloaded'))
  // Get the site data
  const siteData = await config.getSiteData({ dev: false })
  timeEnd(chalk.green('=> [\u2713] Site Data Downloaded'))
  return siteData
}

export const exportSharedRouteData = async (config, sharedProps) => {
  // Write all shared props to file
  const sharedPropsArr = Array.from(sharedProps)

  if (sharedPropsArr.length) {
    console.log('=> Exporting Shared Route Data...')
    const jsonProgress = progress(sharedPropsArr.length)
    time(chalk.green('=> [\u2713] Shared Route Data Exported'))

    await poolAll(
      sharedPropsArr.map(cachedProp => async () => {
        await fs.outputFile(
          path.join(config.paths.STATIC_DATA, `${cachedProp[1].hash}.json`),
          cachedProp[1].jsonString || '{}'
        )
        jsonProgress.tick()
      }),
      Number(config.outputFileRate)
    )
    timeEnd(chalk.green('=> [\u2713] Shared Route Data Exported'))
  }
}

export const fetchRoutes = async config => {
  // Set up some scaffolding for automatic data splitting
  const seenProps = new Map()
  const sharedProps = new Map()

  console.log('=> Fetching Route Data...')
  const dataProgress = progress(config.routes.length)
  time(chalk.green('=> [\u2713] Route Data Downloaded'))

  // Use a traditional for loop here for perf
  const downloadTasks = []
  for (let i = 0; i < config.routes.length; i++) {
    const route = config.routes[i]
    downloadTasks.push(async () => {
      // Fetch allProps from each route
      route.allProps = !!route.getData && (await route.getData({ route, dev: false }))
      // Default allProps (must be an object)
      if (!route.allProps) {
        route.allProps = {}
      }

      // TODO: check if route.allProps is indeed an object

      // Loop through the props to find shared props between routes
      // TODO: expose knobs to tweak these settings, perform them manually,
      // or simply just turn them off.
      Object.keys(route.allProps)
        .map(k => route.allProps[k])
        .forEach(prop => {
          // Don't split small strings
          if (typeof prop === 'string' && prop.length < 100) {
            return
          }
          // Don't split booleans or undefineds
          if (['boolean', 'number', 'undefined'].includes(typeof prop)) {
            return
          }
          // Should be an array or object at this point
          // Have we seen this prop before?
          if (seenProps.get(prop)) {
            // Only cache each shared prop once
            if (sharedProps.get(prop)) {
              return
            }
            // Cache the prop
            const jsonString = JSON.stringify(prop)
            sharedProps.set(prop, {
              jsonString,
              hash: shorthash.unique(jsonString),
            })
          } else {
            // Mark the prop as seen
            seenProps.set(prop, true)
          }
        })
      dataProgress.tick()
    })
  }
  await poolAll(downloadTasks, Number(config.outputFileRate))
  timeEnd(chalk.green('=> [\u2713] Route Data Downloaded'))

  console.log('=> Exporting Route Data...')
  time(chalk.green('=> [\u2713] Route Data Exported'))
  const dataWriteProgress = progress(config.routes.length)
  // Use a traditional for loop for perf here
  const writeTasks = []
  for (let i = 0; i < config.routes.length; i++) {
    const route = config.routes[i]
    writeTasks.push(async () => {
      // Loop through the props and build the prop maps
      route.localProps = {}
      route.sharedPropsHashes = {}
      Object.keys(route.allProps).forEach(key => {
        const value = route.allProps[key]
        const cached = sharedProps.get(value)
        if (cached) {
          route.sharedPropsHashes[key] = cached.hash
        } else {
          route.localProps[key] = value
        }
      })
      dataWriteProgress.tick()
    })
  }
  await poolAll(writeTasks, Number(config.outputFileRate))
  timeEnd(chalk.green('=> [\u2713] Route Data Exported'))

  return exportSharedRouteData(config, sharedProps)
}

const buildHTML = async ({ config: oldConfig, siteData, clientStats }) => {
  const { routes, ...config } = oldConfig
  time(chalk.green('=> [\u2713] HTML Exported'))

  // Single threaded export
  if (config.maxThreads <= 1) {
    console.log('=> Exporting HTML...')
    await exporter({
      config,
      siteData,
      clientStats,
    })
  } else {
    // Multi-threaded export
    const threads = Math.min(cores, config.maxThreads)
    const htmlProgress = progress(config.routes.length)
    console.log(`=> Exporting HTML across ${cores} threads...`)

    const exporters = []
    for (let i = 0; i < threads; i++) {
      exporters.push(
        fork(require.resolve('./threadedExporter'), [], {
          env: {
            ...process.env,
            REACT_STATIC_SLAVE: 'true',
          },
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
          exporter.on('message', ({ type, err }) => {
            if (err) {
              reject(err)
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

// Exporting route HTML and JSON happens here. It's a big one.
export const exportRoutes = async ({ config, clientStats }) => {
  // we modify config in fetchSiteData
  const siteData = await fetchSiteData(config)
  // we modify config in fetchRoutes
  await fetchRoutes(config)

  await buildHTML({
    config,
    siteData,
    clientStats,
  })
}
