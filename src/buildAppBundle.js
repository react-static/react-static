import webpack from 'webpack'
import chalk from 'chalk'
//
import webpackConfig from './webpack.config.prod'
import copyPublicFolder from './copyPublicFolder'
import { DIST } from './paths'

const env = process.env.NODE_ENV
const compiler = webpack(webpackConfig)

console.log(chalk.cyan('=>  webpack is bundling project files...'))
console.log(chalk.green(`=>  NODE_ENV is set to ${chalk.white(env)}.`))

export default () =>
  new Promise((resolve, reject) =>
    compiler.run((err, stats) => {
      if (err) {
        console.log(chalk.red(err.stack || err))
        if (err.details) {
          console.log(chalk.red(err.details))
        }
        reject()
        return 1
      }

      stats.toJson('verbose')

      console.log(
        stats.toString({
          context: webpackConfig.context,
          performance: true,
          hash: true,
          timings: true,
          entrypoints: true,
          chunkOrigins: true,
          chunkModules: false,
          colors: true,
        }),
      )

      const buildErrors = stats.hasErrors()
      const buildWarnings = stats.hasWarnings()

      if (buildErrors) {
        console.log(
          chalk.red.bold(
            `
    ERRORS DURING COMPILATION! :(
=>  Fix them and try again!`,
          ),
        )

        return 1
      }

      console.log(
        chalk.green(
          `
[\u2713] PROJECT FILES ARE COMPILED!
    `,
        ),
      )

      console.log(chalk.green('Syncing files from public to dist'))
      copyPublicFolder(DIST)

      if (buildWarnings) {
        console.log(
          chalk.yellow(
            `
=>  But the build has some issues...
=>  Look at the compiler warnings above!`,
          ),
        )
      }

      // resolve()
      return 0
    }),
  )
