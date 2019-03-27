import React from 'react'
import { renderStylesToString } from 'emotion-server'
import { cache } from 'emotion'
import { CacheProvider } from '@emotion/core'

export default () => ({
  beforeRenderToElement: App => props => (
    <CacheProvider value={cache}>
      <App {...props} />
    </CacheProvider>
  ),
  // Tap into the beforeHtmlToDocument hook and use emotion-server
  // to critically inline the styles from the original
  // html into the a new html string
  beforeHtmlToDocument: renderStylesToString,
})
