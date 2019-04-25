/* eslint-disable import/first, import/order */
const { setIgnorePath } = require('../utils/binHelper')

import path from 'path'
//
import { DefaultDocument } from './components/RootComponents'
import { poolAll, progress } from '../utils'
import exportRoute from './exportRoute'

export default async state => {
  const { config, routes } = state

  const htmlProgress = progress(routes.length)
  // Use the node version of the app created with webpack

  setIgnorePath(config.paths.ARTIFACTS)

  // eslint-disable-next-line
  const Comp = require(path.resolve(config.paths.ARTIFACTS, 'static-app.js'))
    .default

  // Retrieve the document template
  const DocumentTemplate = config.Document || DefaultDocument

  const tasks = []
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    // eslint-disable-next-line
    tasks.push(async () => {
      await exportRoute({
        ...state,
        Comp,
        DocumentTemplate,
        route,
      })
      htmlProgress.tick()
    })
  }
  await poolAll(tasks, Number(config.outputFileRate))
}
