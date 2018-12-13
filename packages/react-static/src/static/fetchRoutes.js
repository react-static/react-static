import chalk from 'chalk'
import exportSharedRouteData from './exportSharedRouteData'
import { progress, time, timeEnd, poolAll } from '../utils'

export default (async function fetchRoutes(config) {
  // Set up some scaffolding for automatic data splitting
  const sharedData = new Map()

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
      // Extract any shared data
      route.sharedDataHashes = {}
      if (route.sharedData) {
        Object.keys(route.sharedData).forEach(key => {
          const sharedPiece = route.sharedData[key]
          sharedData.set(sharedPiece.hash, sharedPiece)
          route.sharedDataHashes[key] = sharedPiece.hash
          route.allProps[key] = sharedPiece.data
        })
      }
      dataProgress.tick()
    })
  }
  await poolAll(downloadTasks, Number(config.outputFileRate))
  timeEnd(chalk.green('=> [\u2713] Route Data Downloaded'))

  return exportSharedRouteData(config, sharedData)
})
