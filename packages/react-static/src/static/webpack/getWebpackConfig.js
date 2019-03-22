import { getStagedRules } from './rules'
import plugins from '../plugins'

// Builds a compiler using a stage preset, then allows extension via
// webpackConfigurator
export default function getWebpackConfig(state) {
  const { stage } = state

  let webpackConfig

  if (stage === 'dev') {
    webpackConfig = require('./webpack.config.dev').default(state)
  } else {
    webpackConfig = require('./webpack.config.prod').default(state)
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
