import chalk from 'chalk'
import fs from 'fs-extra'
//
import { prepareRoutes } from '../static'
import { DefaultDocument } from '../static/RootComponents'
import { startDevServer } from '../static/webpack'
import getConfig from '../static/getConfig'
import { copyPublicFolder, createIndexFilePlaceholder } from '../utils'
//

export default async function start ({ config, isCLI, debug, silent = !isCLI } = {}) {
  // ensure ENV variables are set
  if (typeof process.env.NODE_ENV === 'undefined') {
    process.env.NODE_ENV = 'development'
  }
  process.env.REACT_STATIC_ENV = 'development'
  process.env.BABEL_ENV = 'development'

  // Allow config location to be overriden
  config = getConfig(config)

  if (debug) {
    console.log('DEBUG - Resolved static.config.js:')
    console.log(config)
  }

  // Clean the dist folder
  await fs.remove(config.paths.DIST)

  // Get the site props
  const siteData = await config.getSiteData({ dev: true })

  // Resolve the base HTML template
  const Component = config.Document || DefaultDocument

  // Render an index.html placeholder
  await createIndexFilePlaceholder({
    config,
    Component,
    siteData,
  })

  // Copy the public directory over
  if (!silent) console.log('')
  if (!silent) console.log('=> Copying public directory...')
  console.time(chalk.green('=> [\u2713] Public directory copied'))
  copyPublicFolder(config)
  console.timeEnd(chalk.green('=> [\u2713] Public directory copied'))

  // Build the dynamic routes file (react-static-routes)
  if (!silent) console.log('=> Building Routes...')
  console.time(chalk.green('=> [\u2713] Routes Built'))
  await prepareRoutes(config, { dev: true })
  console.timeEnd(chalk.green('=> [\u2713] Routes Built'))

  // Build the JS bundle
  await startDevServer({ config })
}
