/* eslint-disable import/no-dynamic-require */

const { registerTemplates } = require('./browser')

const { default: templates, notFoundTemplate } = require(process.env
  .REACT_STATIC_TEMPLATES_PATH)

registerTemplates(templates, notFoundTemplate)

if (
  process.env.NODE_ENV !== 'production' &&
  typeof document !== 'undefined' &&
  module &&
  module.hot
) {
  module.hot.accept(process.env.REACT_STATIC_TEMPLATES_PATH, () => {
    const { default: templates, notFoundTemplate } = require(process.env
      .REACT_STATIC_TEMPLATES_PATH)
    registerTemplates(templates, notFoundTemplate)
  })
}
