import fs from 'fs-extra'
//
import { exportRoutes, buildXML, prepareRoutes, getConfig } from '../static'

export default async ({
  config: originalConfig,
  staging,
  debug,
  isBuild,
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

  let config

  // Allow config location to be overriden
  if (!isBuild) {
    config = await getConfig(originalConfig)
    config.originalConfig = originalConfig
    // Restore the process environment variables that were present during the build
    const bundledEnv = await fs.readJson(
      `${config.paths.TEMP}/bundle-environment.json`
    )
    Object.keys(bundledEnv).forEach(key => {
      if (typeof process.env[key] === 'undefined') {
        process.env[key] = bundledEnv[key]
      }
    })
    config = await prepareRoutes({ config, opts: { dev: false } })
  } else {
    config = originalConfig
  }

  if (!config.routes) {
    await prepareRoutes(config, { dev: false })
  }

  if (debug) {
    console.log('DEBUG - Resolved static.config.js:')
    console.log(config)
  }

  const clientStats = await fs.readJson(
    `${config.paths.TEMP}/client-stats.json`
  )

  if (!clientStats) {
    throw new Error('No Client Stats Found')
  }

  try {
    await exportRoutes({
      config,
      clientStats,
    })
  } catch (e) {
    const PrettyError = require('pretty-error')
    console.log(new PrettyError().render(e))
    process.exit(1)
  }

  await buildXML({ config })

  if (config.onBuild) {
    await config.onBuild({ config })
  }
}
