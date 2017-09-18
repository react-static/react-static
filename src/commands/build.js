import fs from 'fs-extra'
import chalk from 'chalk'
//
import { DIST, SRC } from '../paths'
import { getConfig, writeRoutesToStatic } from '../static'
import buildAppBundle from '../buildAppBundle'
import copyPublicFolder from '../copyPublicFolder'
import { normalizeRoutes } from '../static.shared'

export default async () => {
  process.env.NODE_PATH = SRC
  require('module').Module._initPaths()

  try {
    // Clean the dist folder
    await fs.remove(DIST)
    copyPublicFolder(DIST)

    const config = getConfig()
    config.routes = normalizeRoutes(await config.getRoutes({ prod: true }))

    // Build static pages and JSON
    console.log('=>  Exporting Routes...')
    console.time(chalk.green('[\u2713] Routes Exported'))
    await writeRoutesToStatic({ config })
    console.timeEnd(chalk.green('[\u2713] Routes Exported'))

    console.log('=>  Bundling App...')
    console.time(chalk.green('[\u2713] App Bundled'))
    await buildAppBundle()
    console.timeEnd(chalk.green('[\u2713] App Bundled'))

    process.exit(0)
  } catch (err) {
    console.log(err)
  }
}
