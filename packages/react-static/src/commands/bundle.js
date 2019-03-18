import fs from 'fs-extra'
import chalk from 'chalk'
//
import prepareRoutes from '../static/prepareRoutes'
import prepareBrowserPlugins from '../static/prepareBrowserPlugins'
import { buildProductionBundles } from '../static/webpack'
import getConfig from '../static/getConfig'
import extractTemplates from '../static/extractTemplates'
import generateTemplates from '../static/generateTemplates'
import { outputBuildInfo } from '../static/buildInfo'
import { copyPublicFolder, time, timeEnd } from '../utils'

export default (async function bundle({
  config: originalConfig,
  staging,
  debug,
  analyze,
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
  if (analyze) {
    process.env.REACT_STATIC_ANALYZE = 'true'
  }

  // Allow config location to be overriden
  let config = await getConfig(originalConfig)
  config.originalConfig = originalConfig

  if (debug) {
    console.log('DEBUG - Resolved static.config.js:')
    console.log(config)
  }
  console.log('')

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

  if (analyze) {
    await new Promise(() => {})
  }

  return config
})
