import fs from 'fs-extra'
import chalk from 'chalk'
//
import { prepareRoutes } from '../static'
import { buildProductionBundles } from '../static/webpack'
import getConfig from '../static/getConfig'
import { copyPublicFolder } from '../utils'

export default async function build ({
  config, staging, debug, isCLI, silent = !isCLI,
} = {}) {
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
  config = getConfig(config)

  if (debug) {
    console.log('DEBUG - Resolved static.config.js:')
    console.log(config)
  }

  if (!silent) console.log('')

  if (!config.siteRoot) {
    if (!silent) {
      console.log(
        "=> Info: No 'siteRoot' is defined in 'static.config.js'. This is suggested for absolute url's and a sitemap.xml to be automatically generated."
      )
    }
    if (!silent) console.log('')
  }

  // Remove the DIST folder
  await fs.remove(config.paths.DIST)

  if (!silent) console.log('=> Building Routes...')
  if (!silent) console.time(chalk.green('=> [\u2713] Routes Built'))
  await prepareRoutes(config, { dev: false })
  if (!silent) console.timeEnd(chalk.green('=> [\u2713] Routes Built'))

  if (!silent) console.log('=> Copying public directory...')
  if (!silent) console.time(chalk.green('=> [\u2713] Public directory copied'))
  copyPublicFolder(config)
  if (!silent) console.timeEnd(chalk.green('=> [\u2713] Public directory copied'))

  // Build static pages and JSON
  if (!silent) console.log('=> Bundling App...')
  if (!silent) console.time(chalk.green('=> [\u2713] App Bundled'))
  await buildProductionBundles({ config })
  if (!silent) console.timeEnd(chalk.green('=> [\u2713] App Bundled'))

  if (config.bundleAnalyzer) {
    await new Promise(() => {})
  }

  return config
}
