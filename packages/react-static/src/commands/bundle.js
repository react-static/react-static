import fs from 'fs-extra'
import chalk from 'chalk'
//
import getRoutes from '../static/getRoutes'
import generateBrowserPlugins from '../static/generateBrowserPlugins'
import buildProductionBundles from '../static/webpack/buildProductionBundles'
import getConfig from '../static/getConfig'
import extractTemplates from '../static/extractTemplates'
import generateTemplates from '../static/generateTemplates'
import { outputBuildInfo } from '../static/buildInfo'
import { copyPublicFolder, time, timeEnd } from '../utils'

export default (async function bundle(state = {}) {
  const { config: originalConfig, staging, debug, analyze } = state
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

  state.stage = 'prod'

  // Allow config location to be overriden
  await getConfig(state)
  state.config.originalConfig = originalConfig

  if (debug) {
    console.log('DEBUG - Resolved static.config.js:')
    console.log(state)
  }
  console.log('')

  // Remove the DIST folder
  console.log('=> Cleaning dist...')
  time(chalk.green('=> [\u2713] Dist cleaned'))
  await fs.remove(state.config.paths.DIST)
  timeEnd(chalk.green('=> [\u2713] Dist cleaned'))

  // Remove the ARTIFACTS folder
  console.log('=> Cleaning artifacts...')
  time(chalk.green('=> [\u2713] Artifacts cleaned'))
  await fs.remove(state.config.paths.ARTIFACTS)
  timeEnd(chalk.green('=> [\u2713] Artifacts cleaned'))

  // Empty ASSETS folder
  if (
    state.config.paths.ASSETS &&
    state.config.paths.ASSETS !== state.config.paths.DIST
  ) {
    console.log('=> Cleaning assets...')
    time(chalk.green('=> [\u2713] Assets cleaned'))
    await fs.emptyDir(state.config.paths.ASSETS)
    timeEnd(chalk.green('=> [\u2713] Assets cleaned'))
  }

  await generateBrowserPlugins(state)
  await getRoutes(state)
  await extractTemplates(state)
  await generateTemplates(state)

  console.log('=> Copying public directory...')
  time(chalk.green('=> [\u2713] Public directory copied'))
  copyPublicFolder(state)
  timeEnd(chalk.green('=> [\u2713] Public directory copied'))

  // Build static pages and JSON
  console.log('=> Bundling App...')
  time(chalk.green('=> [\u2713] App Bundled'))
  await buildProductionBundles(state)
  timeEnd(chalk.green('=> [\u2713] App Bundled'))

  await outputBuildInfo(state)

  if (analyze) {
    await new Promise(() => {})
  }

  return state
})
