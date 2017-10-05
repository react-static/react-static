import webpack from 'webpack'
import chalk from 'chalk'
import WebpackConfigurator from 'webpack-configurator'
//
import defaultWebpackConfigProd from './webpack.config.prod'
import { getConfig } from './static'

const config = getConfig()
const webpackConfigProd = new WebpackConfigurator()

webpackConfigProd.merge(defaultWebpackConfigProd)
if (config.webpack) {
  config.webpack(webpackConfigProd, { stage: 'production' })
}
const finalWebpackConfigProd = webpackConfigProd.resolve()

const compilerProd = webpack(finalWebpackConfigProd)

export default () => {
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
