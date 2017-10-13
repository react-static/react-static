import fs from 'fs-extra'
import chalk from 'chalk'
import webpack from 'webpack'
import WebpackConfigurator from 'webpack-configurator'
//
import { DIST, SRC } from '../paths'
import {
  getConfig,
  writeRoutesToStatic,
  buildXMLandRSS,
  writeRouteComponentsToFile,
  copyPublicFolder,
} from '../static'
import defaultWebpackConfigProd from '../webpack/webpack.config.prod'

const config = getConfig()
const webpackConfigProd = new WebpackConfigurator()
webpackConfigProd.merge(defaultWebpackConfigProd)
if (config.webpack) {
  config.webpack(webpackConfigProd, { stage: 'production' })
}
const finalWebpackConfigProd = webpackConfigProd.resolve()
const compilerProd = webpack(finalWebpackConfigProd)

const buildAppBundle = () => {
  const build = (stage, compiler) =>
    new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (err) {
          console.log(chalk.red(err.stack || err))
          if (err.details) {
            console.log(chalk.red(err.details))
          }
          return reject(err)
        }

        stats.toJson('verbose')

        const buildErrors = stats.hasErrors()
        const buildWarnings = stats.hasWarnings()

        if (buildErrors || buildWarnings) {
          console.log(
            stats.toString({
              context: webpackConfigProd.context,
              performance: false,
              hash: false,
              timings: true,
              entrypoints: false,
              chunkOrigins: false,
              chunkModules: false,
              colors: true,
            }),
          )
          console.log(
            chalk.red.bold(
              `
=> There were ERRORS during the ${stage} build stage! :(
=> Fix them and try again!`,
            ),
          )
        }

        resolve()
      })
    })

  return Promise.all([build('production', compilerProd)])
}

export default async () => {
  try {
    process.env.NODE_PATH = `${SRC}:${DIST}`
    require('module').Module._initPaths()
    const config = getConfig()
    await fs.remove(DIST)

    console.log('')
    console.time('=> Site is ready for production!')

    console.log('=> Copying public directory...')
    console.time(chalk.green('=> [\u2713] Public directory copied'))
    copyPublicFolder(DIST)
    console.timeEnd(chalk.green('=> [\u2713] Public directory copied'))

    console.log('=> Building Routes...')
    console.time(chalk.green('=> [\u2713] Routes Built'))
    config.routes = await config.getRoutes({ dev: false })
    await writeRouteComponentsToFile(config.routes)
    console.timeEnd(chalk.green('=> [\u2713] Routes Built'))

    // Build static pages and JSON
    console.log('=> Bundling App...')
    console.time(chalk.green('=> [\u2713] App Bundled'))
    await buildAppBundle()
    console.timeEnd(chalk.green('=> [\u2713] App Bundled'))

    if (config.bundleAnalyzer) {
      await new Promise(() => {})
    }

    console.log('=> Exporting Routes...')
    console.time(chalk.green('=> [\u2713] Routes Exported'))
    await writeRoutesToStatic({ config })
    await buildXMLandRSS({ config })
    console.timeEnd(chalk.green('=> [\u2713] Routes Exported'))

    console.timeEnd('=> Site is ready for production!')
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
