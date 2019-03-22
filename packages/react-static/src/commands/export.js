import exportRoutesRunner from '../static/exportRoutesRunner'
import getRoutes from '../static/getRoutes'
import getConfig from '../static/getConfig'
import extractTemplates from '../static/extractTemplates'
import { importClientStats } from '../static/clientStats'
import plugins from '../static/plugins'

export default async (state = {}) => {
  const { config: originalConfig, staging, debug, isBuild, incremental } = state
  // ensure ENV variables are set
  if (typeof process.env.NODE_ENV === 'undefined' && !debug) {
    process.env.NODE_ENV = 'production'
  }

  process.env.REACT_STATIC_ENV = 'production'
  process.env.BABEL_ENV = 'production'

  if (staging) {
    process.env.REACT_STATIC_STAGING = 'true'
  }

  if (debug) {
    process.env.REACT_STATIC_DEBUG = 'true'
  }

  if (incremental) {
    process.env.REACT_STATIC_INCREMENTAL = 'true'
  }

  state.stage = 'prod'

  // Allow config location to be overriden
  if (!isBuild) {
    state.config = await getConfig(originalConfig)
    state.config.originalConfig = originalConfig
    state.config = await getRoutes(state)
    await extractTemplates(state)
  } else {
    state.config = originalConfig
  }

  if (!state.routes) {
    await getRoutes(state)
  }

  if (debug) {
    console.log('DEBUG - Resolved static.config.js:')
    console.log(state)
  }

  await importClientStats(state)

  try {
    await exportRoutesRunner(state)
  } catch (e) {
    const PrettyError = require('pretty-error')
    console.log(new PrettyError().render(e))
    process.exit(1)
  }

  await plugins.afterExport(state)
}
