import fs from 'fs-extra'
import chalk from 'chalk'
//
import { exportRoutes, buildXMLandRSS, prepareRoutes } from '../static'
import getConfig from '../static/getConfig'

export default async ({
  config, staging, debug, isCLI, silent = !isCLI,
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
  if (config && typeof config === 'object' && !config.generated) {
    config = getConfig(config)
  }

  if (!config.routes) {
    if (!silent) console.log('=> Building Routes...')
    if (!silent) console.time(chalk.green('=> [\u2713] Routes Built'))
    await prepareRoutes(config, { dev: false })
    if (!silent) console.timeEnd(chalk.green('=> [\u2713] Routes Built'))
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
