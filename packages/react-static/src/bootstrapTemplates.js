import templates from 'react-static/templates'
import { registerTemplates } from 'react-static'

registerTemplates(templates)

if (typeof document !== 'undefined' && module && module.hot) {
  module.hot.accept('react-static/templates', () => {
    registerTemplates(require('react-static/templates').default)
  })
}
