const { default: create } = require('../lib/commands/create')
const { default: start } = require('../lib/commands/start')
const { default: build } = require('../lib/commands/build')
const { default: bundle } = require('../lib/commands/bundle')
const { default: exporter } = require('../lib/commands/export')
const { reloadClientData } = require('../lib/static/webpack/runDevServer')
const { default: makePageRoutes } = require('../lib/node/makePageRoutes')
const { normalizeRoutes } = require('../lib/static/getConfig')
const { default: createSharedData } = require('../lib/static/createSharedData')

module.exports = {
  create,
  start,
  build,
  bundle,
  export: exporter,
  reloadClientData,
  makePageRoutes,
  normalizeRoutes,
  createSharedData,
}
