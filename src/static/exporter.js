/* eslint-disable import/first, import/no-dynamic-require */

require('../utils/binHelper')

import glob from 'glob'
import path from 'path'

import { DefaultDocument } from './RootComponents'
import { poolAll } from '../utils/shared'
import exportRoute from './exportRoute'
import { progress } from '../utils'

export default async ({ config, siteData, clientStats }) => {
  const htmlProgress = progress(config.routes.length)
  // Use the node version of the app created with webpack
  const Comp = require(glob.sync(path.resolve(config.paths.ASSETS, 'static.*.js'))[0]).default
  // Retrieve the document template
  const DocumentTemplate = config.Document || DefaultDocument

  const tasks = []
  for (let i = 0; i < config.routes.length; i++) {
    const route = config.routes[i]
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
