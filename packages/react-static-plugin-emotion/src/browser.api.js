import { sheet } from 'emotion'

// For now, speedy must be disabled for hydration to work correctly with react-statics
if (
  typeof document !== 'undefined' &&
  !document.getElementById('root').hasChildNodes()
) {
  sheet.speedy(false)
}

export default () => ({})
