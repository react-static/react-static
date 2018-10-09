/* eslint-disable import/first, import/no-dynamic-require */

const { setIgnorePath } = require('../utils/binHelper')

import glob from 'glob'
import path from 'path'

import { DefaultDocument } from './RootComponents'
import { poolAll, progress } from '../utils'
import exportRoute from './exportRoute'

export default async ({ config, routes, siteData, clientStats }) => {
  const htmlProgress = progress(routes.length)
  // Use the node version of the app created with webpack

  setIgnorePath(config.paths.DIST)

  const Comp = require(glob.sync(
    path.resolve(config.paths.ASSETS, 'static.*.js')
  )[0]).default
  // Retrieve the document template
  const DocumentTemplate = config.Document || DefaultDocument

  const tasks = []
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    // eslint-disable-next-line
    tasks.push(async () => {
      await exportRoute({
        config,
        Comp,
        DocumentTemplate,
        route,
        siteData,
        clientStats,
      })
      htmlProgress.tick()
    })
  }
  await poolAll(tasks, Number(config.outputFileRate))
}
