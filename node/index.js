const create = require('../lib/commands/create').default
const start = require('../lib/commands/start').default
const build = require('../lib/commands/build').default
const { reloadRoutes } = require('../lib/static/webpack')

module.exports = {
  create,
  start,
  build,
  reloadRoutes,
}
