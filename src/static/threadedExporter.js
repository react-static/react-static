/* eslint-disable import/first, import/no-dynamic-require */

require('@babel/register')
require('../utils/binHelper')

import glob from 'glob'
import path from 'path'

import getConfig from './getConfig'
import { DefaultDocument } from './RootComponents'
import { poolAll } from '../utils/shared'
import exportRoute from './exportRoute'

process.on('message', async payload => {
  try {
    const { config: oldConfig, routes } = payload
    // Get config again
    const config = await getConfig(oldConfig.originalConfig)
    // Use the node version of the app created with webpack
    const Comp = require(glob.sync(path.resolve(config.paths.DIST, 'static.*.js'))[0]).default
    // Retrieve the document template
    const DocumentTemplate = config.Document || DefaultDocument

    const tasks = []
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      tasks.push(async () => {
        await exportRoute({
          ...payload,
          config,
          route,
          Comp,
          DocumentTemplate,
        })
        if (process.connected) {
          process.send({ type: 'tick' })
        }
      })
    }
    await poolAll(tasks, Number(config.outputFileRate))
    if (process.connected) {
      process.send({ type: 'done' })
    }
  } catch (err) {
    console.error(err)
    if (process.connected) {
      process.send({ type: 'error', err })
    }
  }
})
