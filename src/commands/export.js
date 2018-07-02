import fs from 'fs-extra'
import chalk from 'chalk'
//
import { exportRoutes, buildXMLandRSS, prepareRoutes } from '../static'
import getConfig from '../static/getConfig'
import { timeEnd, time } from '../utils'

export default async ({
  config, staging, debug, isBuild,
} = {}) => {
  // ensure ENV variables are set
  if (typeof process.env.NODE_ENV === 'undefined' && !debug) {
    process.env.NODE_ENV = 'production'
  }

  process.env.REACT_STATIC_ENV = 'production'
  process.env.BABEL_ENV = 'production'

  if (staging) {
    process.env.REACT_STATIC_STAGING = true
  }

  if (debug) {
    process.env.REACT_STATIC_DEBUG = true
  }

  // Allow config location to be overriden
  if (!isBuild) {
    config = await getConfig(config)
    // Restore the process environment variables that were present during the build
    const bundledEnv = await fs.readJson(`${config.paths.DIST}/bundle-environment.json`)
    Object.keys(bundledEnv).forEach(key => {
      if (typeof process.env[key] === 'undefined') {
        process.env[key] = bundledEnv[key]
      }
    })
    config = await prepareRoutes({ config, opts: { dev: false } })
  }

  if (!config.routes) {
    await prepareRoutes(config, { dev: false })
  }

  if (debug) {
    console.log('DEBUG - Resolved static.config.js:')
    console.log(config)
  }

  const clientStats = await fs.readJson(`${config.paths.DIST}/client-stats.json`)

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
    console.log() // new line
    console.log(new PrettyError().render(e))
    process.exit(1)
  }

  await buildXMLandRSS({ config })

  if (config.onBuild) {
    await config.onBuild({ config })
  }
}
