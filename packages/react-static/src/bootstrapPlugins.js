/* eslint-disable import/no-dynamic-require */

const plugins = require(process.env.REACT_STATIC_PLUGINS_PATH).default
const { registerPlugins } = require('./browser')

registerPlugins(plugins)

if (typeof document !== 'undefined' && module && module.hot) {
  module.hot.accept(process.env.REACT_STATIC_PLUGINS_PATH, () => {
    registerPlugins(require(process.env.REACT_STATIC_PLUGINS_PATH).default)
  })
}
