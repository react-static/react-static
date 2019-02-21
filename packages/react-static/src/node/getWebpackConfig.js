import getConfig from '../static/getConfig'
import { webpackConfig } from '../static/webpack'

// Required so handle static.config.js defined as es module
require('../utils/binHelper')

export default (function getWebpackConfig(configPath, stage = 'dev') {
  return webpackConfig({ config: getConfig(), stage })
})
