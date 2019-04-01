import { getStagedRules } from './rules'
import plugins from '../plugins'

// Builds a compiler using a stage preset, then allows extension via
// webpackConfigurator
export default function makeWebpackConfig(state) {
  const { stage } = state

  let webpackConfig

  if (stage === 'dev') {
    webpackConfig = require('./webpack.config.dev').default(state)
  } else if (['prod', 'node'].includes(stage)) {
    webpackConfig = require('./webpack.config.prod').default(state)
  } else {
    throw new Error(
      `An invalid stage option was detected: ${stage.toString()}. Stage must equal one of: 'prod', 'dev', or 'node'.`
    )
  }

  // set the default loaders
  state = {
    ...state,
    defaultLoaders: getStagedRules(state),
  }

  // run the webpack plugin (should be synchronous)
  webpackConfig = plugins.webpack(webpackConfig, state)

  return webpackConfig
}
