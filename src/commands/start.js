import chalk from 'chalk'
import fs from 'fs-extra'
//
import { prepareRoutes } from '../static'
import { DefaultDocument } from '../static/RootComponents'
import { startDevServer } from '../static/webpack'
import getConfig from '../static/getConfig'
import { copyPublicFolder, createIndexFilePlaceholder } from '../utils'
//

export default (...args) => {
  try {
    return start(...args)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

async function start ({ config, isCLI, silent = !isCLI } = {}) {
  try {
    // Allow config location to be overriden
    if (!config || typeof config === 'string') {
      config = getConfig(config)
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
  } catch (err) {
    if (!silent) console.log(err)
    process.exit(1)
  }
}
