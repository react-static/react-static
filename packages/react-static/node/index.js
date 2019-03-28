const { default: create } = require('../lib/commands/create')
const { default: start } = require('../lib/commands/start')
const { default: build } = require('../lib/commands/build')
const { default: bundle } = require('../lib/commands/bundle')
const { default: exporter } = require('../lib/commands/export')
const { reloadRoutes } = require('../lib/static/webpack')
const { default: makePageRoutes } = require('../lib/node/makePageRoutes')
const { default: getWebpackConfig } = require('../lib/node/getWebpackConfig')
const {
  default: getWebpackConfigSync,
} = require('../lib/node/getWebpackConfigSync')
const { normalizeRoutes } = require('../lib/static/getConfig')
const { default: createSharedData } = require('../lib/static/createSharedData')

module.exports = {
  create,
  start,
  build,
  bundle,
  export: exporter,
  reloadRoutes,
  makePageRoutes,
  getWebpackConfig,
  getWebpackConfigSync,
  normalizeRoutes,
  createSharedData,
}
