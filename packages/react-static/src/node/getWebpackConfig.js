// Require the binHelper first
require('../utils/binHelper')

const getConfig = require('../static/getConfig')
const makeWebpackConfig = require('../static/webpack/makeWebpackConfig')

// Required so handle static.config.js defined as es module

export default function getWebpackConfig(configPath, stage = 'dev') {
  let state = {
    configPath,
    stage,
  }
  state = getConfig(state)
  return makeWebpackConfig(state)
}
