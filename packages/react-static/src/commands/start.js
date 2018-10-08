import fs from 'fs-extra'
//
import { prepareRoutes, preparePlugins } from '../static'
import { DefaultDocument } from '../static/RootComponents'
import { startDevServer, reloadRoutes } from '../static/webpack'
import getConfig from '../static/getConfig'
import { createIndexFilePlaceholder } from '../utils'
//

let cleaned
let indexCreated

export default (async function start({ config, debug } = {}) {
  // ensure ENV variables are set
  if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = 'development'
  }
  process.env.REACT_STATIC_ENV = 'development'
  process.env.BABEL_ENV = 'development'

  // Use callback style to subscribe to changes
  await getConfig(config, async config => {
    if (debug) {
      console.log('DEBUG - Resolved static.config.js:')
      console.log(config)
    }

    if (!cleaned) {
      cleaned = true
      // Clean the dist folder
      await fs.remove(config.paths.DIST)
    }

    // Get the site props
    const siteData = await config.getSiteData({ dev: true })

    // Resolve the base HTML template
    const Component = config.Document || DefaultDocument

    if (!indexCreated) {
      indexCreated = true
      // Render an index.html placeholder
      await createIndexFilePlaceholder({
        config,
        Component,
        siteData,
      })
    }

    await preparePlugins({ config })

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
