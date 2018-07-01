import fs from 'fs-extra'
import chalk from 'chalk'
//
import { prepareRoutes } from '../static'
import { buildProductionBundles } from '../static/webpack'
import getConfig from '../static/getConfig'
import { copyPublicFolder, time, timeEnd } from '../utils'

export default async function build ({ config, staging, debug } = {}) {
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
  config = await getConfig(config)

  if (debug) {
    console.log('DEBUG - Resolved static.config.js:')
    console.log(config)
  }
  console.log('')

  if (!config.siteRoot) {
    console.log(
      "=> Info: No 'siteRoot' is defined in 'static.config.js'. This is suggested for absolute url's and a sitemap.xml to be automatically generated."
    )
    console.log('')
  }

  // Remove the DIST folder
  console.log('=> Cleaning dist...')
  time(chalk.green('=> [\u2713] Dist cleaned'))
  await fs.remove(config.paths.DIST)
  timeEnd(chalk.green('=> [\u2713] Dist cleaned'))

  config = await prepareRoutes({ config, opts: { dev: false } })

  console.log('=> Copying public directory...')
  time(chalk.green('=> [\u2713] Public directory copied'))
  copyPublicFolder(config)
  timeEnd(chalk.green('=> [\u2713] Public directory copied'))

  // Build static pages and JSON
  console.log('=> Bundling App...')
  time(chalk.green('=> [\u2713] App Bundled'))
  await buildProductionBundles({ config })
  timeEnd(chalk.green('=> [\u2713] App Bundled'))

  if (config.bundleAnalyzer) {
    await new Promise(() => {})
  }

  return config
}
