import fs from 'fs-extra'
import chalk from 'chalk'
//
import {
  prepareRoutes,
  prepareBrowserPlugins,
  buildProductionBundles,
  getConfig,
  extractTemplates,
  generateTemplates,
  outputBuildInfo,
} from '../static'

import { copyPublicFolder, time, timeEnd } from '../utils'

export default (async function bundle({
  config: originalConfig,
  staging,
  debug,
} = {}) {
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

  // Allow config location to be overriden
  let config = await getConfig(originalConfig)
  config.originalConfig = originalConfig

  if (debug) {
    console.log('DEBUG - Resolved static.config.js:')
    console.log(config)
  }
  console.log('')

  if (!config.siteRoot) {
    console.log(
      "=> Info: No 'siteRoot' is defined in 'static.config.js'. This is suggested for absolute urls and also required to automatically generate a sitemap.xml."
    )
    console.log('')
  }

  // Remove the DIST folder
  console.log('=> Cleaning dist...')
  time(chalk.green('=> [\u2713] Dist cleaned'))
  await fs.remove(config.paths.DIST)
  timeEnd(chalk.green('=> [\u2713] Dist cleaned'))

  // Remove the ARTIFACTS folder
  console.log('=> Cleaning artifacts...')
  time(chalk.green('=> [\u2713] Artifacts cleaned'))
  await fs.remove(config.paths.BUILD_ARTIFACTS)
  timeEnd(chalk.green('=> [\u2713] Artifacts cleaned'))

  // Empty ASSETS folder
  if (config.paths.ASSETS && config.paths.ASSETS !== config.paths.DIST) {
    console.log('=> Cleaning assets...')
    time(chalk.green('=> [\u2713] Assets cleaned'))
    await fs.emptyDir(config.paths.ASSETS)
    timeEnd(chalk.green('=> [\u2713] Assets cleaned'))
  }

  config = await prepareBrowserPlugins(config)
  config = await prepareRoutes(config)
  await extractTemplates(config)
  await generateTemplates(config)

  console.log('=> Copying public directory...')
  time(chalk.green('=> [\u2713] Public directory copied'))
  copyPublicFolder(config)
  timeEnd(chalk.green('=> [\u2713] Public directory copied'))

  // Build static pages and JSON
  console.log('=> Bundling App...')
  time(chalk.green('=> [\u2713] App Bundled'))
  await buildProductionBundles({ config })
  timeEnd(chalk.green('=> [\u2713] App Bundled'))

  await outputBuildInfo(config)

  if (config.bundleAnalyzer) {
    await new Promise(() => {})
  }

  return config
})
