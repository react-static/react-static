import getConfig from '../static/getConfig'
import { webpackConfig } from '../static/webpack'

// Required so handle static.config.js defined as es module
require('../utils/binHelper')

export default (function getWebpackConfig(configPath, stage = 'dev') {
  return new Promise(resolve =>
    getConfig(configPath, staticConfig =>
      resolve(webpackConfig({ config: staticConfig, stage }))
    )
  )
})
