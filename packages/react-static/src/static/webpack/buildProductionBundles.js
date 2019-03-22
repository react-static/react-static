/* eslint-disable import/no-dynamic-require, react/no-danger, import/no-mutable-exports */
import webpack from 'webpack'
import chalk from 'chalk'
//
import getWebpackConfig from './getWebpackConfig'
import { outputClientStats } from '../clientStats'

export async function buildProductionBundles(state) {
  const allWebpackConfigs = [
    await getWebpackConfig(state),
    await getWebpackConfig({ ...state, stage: 'node' }), // Make sure we're building the node config
  ]
  return new Promise(async (resolve, reject) => {
    webpack(allWebpackConfigs).run(async (err, stats) => {
      if (err) {
        console.log(chalk.red(err.stack || err))
        if (err.details) {
          console.log(chalk.red(err.details))
        }
        return reject(err)
      }

      stats.toJson('verbose')

      const [prodStats, nodeStats] = stats.stats

      checkBuildStats('prod', prodStats)
      checkBuildStats('node', nodeStats)

      function checkBuildStats(stage, stageStats) {
        const buildErrors = stageStats.hasErrors()
        const buildWarnings = stageStats.hasWarnings()

        if (buildErrors || buildWarnings) {
          console.log(
            stageStats.toString({
              context: state.config.context,
              performance: false,
              hash: false,
              timings: true,
              entrypoints: false,
              chunkOrigins: false,
              chunkModules: false,
              colors: true,
            })
          )
          if (buildErrors) {
            console.log(
              chalk.red.bold(`
                => There were ERRORS during the ${stage} build stage! :(
                => Fix them and try again!
              `)
            )
          } else if (buildWarnings) {
            console.log(
              chalk.yellow(`
=> There were WARNINGS during the ${stage} build stage. Your site will still function, but you may achieve better performance by addressing the warnings above.
`)
            )
          }
        }
      }

      state.prodStatsJson = prodStats.toJson()

      await outputClientStats(state)
    })
  })
}
