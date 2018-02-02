import fs from 'fs-extra'
import chalk from 'chalk'
//
import { exportRoutes, buildXMLandRSS, prepareRoutes } from '../static'
import { buildProductionBundles } from '../webpack'
import { getConfig, copyPublicFolder } from '../utils'

export default async cliArguments => {
  try {
    if (cliArguments.includes('--staging')) {
      process.env.REACT_STATIC_STAGING = true
    }

    const config = getConfig()
    await fs.remove(config.paths.DIST)

    console.log('')
    console.time('=> Site is ready for production!')

    console.log('=> Copying public directory...')
    console.time(chalk.green('=> [\u2713] Public directory copied'))
    copyPublicFolder(config)
    console.timeEnd(chalk.green('=> [\u2713] Public directory copied'))

    console.log('=> Building Routes...')
    console.time(chalk.green('=> [\u2713] Routes Built'))
    config.routes = await config.getRoutes({ dev: false })
    await prepareRoutes(config)
    console.timeEnd(chalk.green('=> [\u2713] Routes Built'))

    // Build static pages and JSON
    console.log('=> Bundling App...')
    console.time(chalk.green('=> [\u2713] App Bundled'))
    const clientStats = await buildProductionBundles({ config })
    console.timeEnd(chalk.green('=> [\u2713] App Bundled'))

    if (config.bundleAnalyzer) {
      await new Promise(() => {})
    }

    console.log('=> Exporting Routes...')
    console.time(chalk.green('=> [\u2713] Routes Exported'))
    await exportRoutes({
      config,
      clientStats,
      cliArguments,
    })
    await buildXMLandRSS({ config })
    console.timeEnd(chalk.green('=> [\u2713] Routes Exported'))

    console.timeEnd('=> Site is ready for production!')
    if (config.onBuild) {
      await config.onBuild({ config })
    }
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
