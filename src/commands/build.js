import fs from 'fs-extra'
import chalk from 'chalk'
//
import { exportRoutes, buildXMLandRSS, prepareRoutes } from '../static'
import { buildProductionBundles } from '../static/webpack'
import getConfig from '../static/getConfig'
import { copyPublicFolder } from '../utils'

export default (...args) => {
  try {
    return build(...args)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}

async function build ({ config, staging, debug, isCLI, silent = !isCLI } = {}) {
  try {
    if (staging) {
      process.env.REACT_STATIC_STAGING = true
    }
    if (debug) {
      process.env.REACT_STATIC_DEBUG = true
    }

    // Allow config location to be overriden
    if (!config || typeof config === 'string') {
      config = getConfig(config)
    }

    await fs.remove(config.paths.DIST)

    if (!silent) console.log('')

    if (!config.siteRoot) {
      if (!silent) {
        console.log(
          "=> Info: No 'siteRoot' is defined in 'static.config.js'. This is suggested for absolute url's and a sitemap.xml to be automatically generated."
        )
      }
      if (!silent) console.log('')
    }

    if (!silent) console.time('=> Site is ready for production!')

    if (!silent) console.log('=> Copying public directory...')
    if (!silent) console.time(chalk.green('=> [\u2713] Public directory copied'))
    copyPublicFolder(config)
    if (!silent) console.timeEnd(chalk.green('=> [\u2713] Public directory copied'))

    if (!silent) console.log('=> Building Routes...')
    if (!silent) console.time(chalk.green('=> [\u2713] Routes Built'))
    await prepareRoutes(config, { dev: false })
    if (!silent) console.timeEnd(chalk.green('=> [\u2713] Routes Built'))

    // Build static pages and JSON
    if (!silent) console.log('=> Bundling App...')
    if (!silent) console.time(chalk.green('=> [\u2713] App Bundled'))
    const clientStats = await buildProductionBundles({ config })
    if (!silent) console.timeEnd(chalk.green('=> [\u2713] App Bundled'))

    if (config.bundleAnalyzer) {
      await new Promise(() => {})
    }

    await exportRoutes({
      config,
      clientStats,
    })
    await buildXMLandRSS({ config })

    if (!silent) console.timeEnd('=> Site is ready for production!')
    if (config.onBuild) {
      await config.onBuild({ config })
    }
    process.exit(0)
  } catch (err) {
    if (!silent) console.log(err)
    process.exit(1)
  }
}
