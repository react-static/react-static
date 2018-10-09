import { renderStylesToString } from 'emotion-server'

export default options => ({
  // Tap into the beforeHtmlToDocument hook and use emotion-server
  // to critically inline the styles from the original
  // html into the a new html string
  beforeHtmlToDocument: renderStylesToString,
})
