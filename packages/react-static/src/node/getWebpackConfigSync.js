import getConfig from '../static/getConfig'
import { webpackConfig } from '../static/webpack'

// Required so handle static.config.js defined as es module
require('../utils/binHelper')

export default (function getWebpackConfigSync(configPath, stage = 'dev') {
  const staticConfig = getConfig(configPath, undefined, { sync: true })
  return webpackConfig({ config: staticConfig, stage, sync: true })
})
