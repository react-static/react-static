import chalk from 'chalk'
import exportSharedRouteData from './exportSharedRouteData'
import { progress, time, timeEnd, poolAll } from '../utils'

export default (async function fetchRoutes(config) {
  // Set up some scaffolding for automatic data splitting
  const sharedDataByHash = new Map()

  console.log('=> Fetching Route Data...')
  const dataProgress = progress(config.routes.length)
  time(chalk.green('=> [\u2713] Route Data Downloaded'))

  // Use a traditional for loop here for perf
  const downloadTasks = []
  for (let i = 0; i < config.routes.length; i++) {
    const route = config.routes[i]
    /* eslint-disable no-loop-func */
    downloadTasks.push(async () => {
      // Fetch data from each route
      route.data =
        !!route.getData && (await route.getData({ route, dev: false }))
      // Default data (must be an object)
      if (!route.data) {
        route.data = {}
      }
      // Extract any shared data
      route.sharedHashesByProp = {}
      if (route.sharedData) {
        Object.keys(route.sharedData).forEach(name => {
          const sharedPiece = route.sharedData[name]
          sharedDataByHash.set(sharedPiece.hash, sharedPiece)
          route.sharedHashesByProp[name] = sharedPiece.hash
          route.sharedData[name] = sharedPiece.data
        })
      }
      dataProgress.tick()
    })
  }
  await poolAll(downloadTasks, Number(config.outputFileRate))
  timeEnd(chalk.green('=> [\u2713] Route Data Downloaded'))

  return exportSharedRouteData(config, sharedDataByHash)
})
