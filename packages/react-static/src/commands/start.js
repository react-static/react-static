import fs from 'fs-extra'
//
import {
  prepareRoutes,
  preparePlugins,
  startDevServer,
  reloadRoutes,
  getConfig,
} from '../static'
import { createIndexFilePlaceholder } from '../utils'
//

let cleaned
let indexCreated

export default (async function start({ configPath, debug } = {}) {
  // ensure ENV variables are set
  if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = 'development'
  }
  if (debug) {
    process.env.REACT_STATIC_DEBUG = 'true'
  }
  process.env.REACT_STATIC_ENV = 'development'
  process.env.BABEL_ENV = 'development'

  // Use callback style to subscribe to changes
  await getConfig(configPath, async config => {
    if (debug) {
      console.log('DEBUG - Resolved static.config.js:')
      console.log(config)
    }

    // TODO: move to plugin
    if (!cleaned) {
      cleaned = true
      // Clean the dist folder
      await fs.remove(config.paths.DIST)
    }

    // Get the site data
    // TODO: move to plugin
    config.siteData = await config.getSiteData({ dev: true })

    // Render an index.html placeholder
    // TODO: move to plugin
    if (!indexCreated) {
      indexCreated = true
      await createIndexFilePlaceholder({
        config,
      })
    }

    config = await preparePlugins({ config })

    // TODO: move to plugin
    await prepareRoutes({ config, opts: { dev: true } }, async config => {
      reloadRoutes()

      // Build the JS bundle
      await startDevServer({ config })
    })
  })

  await new Promise(() => {
    // Do nothing, the user must exit this command
  })
})
