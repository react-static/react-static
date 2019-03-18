import exportRoutesRunner from '../static/exportRoutesRunner'
import prepareRoutes from '../static/prepareRoutes'
import getConfig from '../static/getConfig'
import extractTemplates from '../static/extractTemplates'
import { importClientStats } from '../static/clientStats'
import { makeHookMapper } from '../utils'

export default async ({
  config: originalConfig,
  staging,
  debug,
  isBuild,
  incremental,
} = {}) => {
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

  let config

  // Allow config location to be overriden
  if (!isBuild) {
    config = await getConfig(originalConfig)
    config.originalConfig = originalConfig
    config = await prepareRoutes(config, { incremental })
    await extractTemplates(config, { incremental })
  } else {
    config = originalConfig
  }

  if (!config.routes) {
    await prepareRoutes(config)
  }

  if (debug) {
    console.log('DEBUG - Resolved static.config.js:')
    console.log(config)
  }

  const clientStats = await importClientStats(config)

  try {
    await exportRoutesRunner({
      config,
      clientStats,
      incremental,
    })
  } catch (e) {
    const PrettyError = require('pretty-error')
    console.log(new PrettyError().render(e))
    process.exit(1)
  }

  const afterExport = makeHookMapper(config.plugins, 'afterExport')

  await afterExport({
    config,
    clientStats,
  })
}
