const { default: create } = require('../lib/commands/create')
const { default: start } = require('../lib/commands/start')
const { default: build } = require('../lib/commands/build')
const { default: bundle } = require('../lib/commands/bundle')
const { default: exporter } = require('../lib/commands/export')
const { reloadRoutes } = require('../lib/static/webpack')
const { default: makePageRoutes } = require('../lib/node/makePageRoutes')
const { normalizeRoutes } = require('../lib/static/getConfig')

module.exports = {
  create,
  start,
  build,
  bundle,
  export: exporter,
  reloadRoutes,
  makePageRoutes,
  normalizeRoutes,
}
