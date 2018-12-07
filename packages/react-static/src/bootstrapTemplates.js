/* eslint-disable import/no-dynamic-require */

const templates = require(process.env.REACT_STATIC_TEMPLATES_PATH).default
const { registerTemplates } = require('./browser')

registerTemplates(templates)

if (typeof document !== 'undefined' && module && module.hot) {
  module.hot.accept(process.env.REACT_STATIC_TEMPLATES_PATH, () => {
    registerTemplates(require(process.env.REACT_STATIC_TEMPLATES_PATH).default)
  })
}
