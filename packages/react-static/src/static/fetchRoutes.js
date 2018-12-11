import chalk from 'chalk'
import shorthash from 'shorthash'
import exportSharedRouteData from './exportSharedRouteData'
import { progress, time, timeEnd, poolAll } from '../utils'

export default (async function fetchRoutes(config) {
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
    /* eslint-disable no-loop-func */
    downloadTasks.push(async () => {
      // Fetch allProps from each route
      route.allProps =
        !!route.getData && (await route.getData({ route, dev: false }))
      // Default allProps (must be an object)
      if (!route.allProps) {
        route.allProps = {}
      }

      // Loop through the props to find shared props between routes
      // TODO: Make this smarter and/or expose knobs to tweak these settings / perform them manually,
      // or simply just turn them off.
      const propKeys = Object.keys(route.allProps)
      for (let i = 0; i < propKeys.length; i++) {
        const prop = route.allProps[propKeys[i]]
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
      }
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
  console.log('hello')
  await poolAll(writeTasks, Number(config.outputFileRate))
  timeEnd(chalk.green('=> [\u2713] Route Data Exported'))

  return exportSharedRouteData(config, sharedProps)
})
