import chalk from 'chalk'
import fs from 'fs-extra'
//
import { prepareRoutes } from '../static'
import { DefaultDocument } from '../RootComponents'
import { startDevServer } from '../webpack'
import { getConfig, copyPublicFolder, createIndexFilePlaceholder } from '../utils'
//

export default async cliArguments => {
  try {
    // Get the config
    const config = getConfig()

    // Clean the dist folder
    await fs.remove(config.paths.DIST)

    // Get the site props
    const siteData = await config.getSiteData({ dev: true, cliArguments })

    // Resolve the base HTML template
    const Component = config.Document || DefaultDocument

    // Render an index.html placeholder
    await createIndexFilePlaceholder({
      config,
      Component,
      siteData
    })

    // Copy the public directory over
    console.log('')
    console.log('=> Copying public directory...')
    console.time(chalk.green('=> [\u2713] Public directory copied'))
    copyPublicFolder(config)
    console.timeEnd(chalk.green('=> [\u2713] Public directory copied'))

    // Build the dynamic routes file (react-static-routes)
    console.log('=> Building Routes...')
    console.time(chalk.green('=> [\u2713] Routes Built'))
    config.routes = await config.getRoutes({ dev: true })
    await prepareRoutes(config)
    console.timeEnd(chalk.green('=> [\u2713] Routes Built'))

    // Build the JS bundle
    await startDevServer({ config })
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
