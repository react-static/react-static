import fs from 'fs-extra'
import chalk from 'chalk'
//
import { DIST, SRC } from '../paths'
import { getConfig, writeRoutesToStatic } from '../static'
import buildAppBundle from '../buildAppBundle'
import copyPublicFolder from '../copyPublicFolder'
import { normalizeRoutes } from '../shared'

export default async () => {
  process.env.NODE_PATH = SRC
  require('module').Module._initPaths()

  console.log('')
  try {
    console.time('Site is ready for production!')
    // Clean the dist folder
    console.log('=> Copying public directory...')
    console.time(chalk.green('=> [\u2713] Public directory copied'))
    await fs.remove(DIST)
    copyPublicFolder(DIST)
    console.timeEnd(chalk.green('=> [\u2713] Public directory copied'))

    const config = getConfig()
    config.routes = normalizeRoutes(await config.getRoutes({ prod: true }))

    // Build static pages and JSON
    console.log('=> Exporting Routes...')
    console.time(chalk.green('=> [\u2713] Routes Exported'))
    await writeRoutesToStatic({ config })
    console.timeEnd(chalk.green('=> [\u2713] Routes Exported'))

    console.log('=> Bundling App...')
    console.time(chalk.green('=> [\u2713] App Bundled'))
    await buildAppBundle()
    console.timeEnd(chalk.green('=> [\u2713] App Bundled'))

    console.timeEnd('Site is ready for production!')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
