import React from 'react'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default () => ({
  webpack: (config, { stage }) => {
    // Make sure the stylesheet instance is the same across the node instance
    if (stage === 'node') {
      config.externals.push('styled-components')
    }
    return config
  },
  // Use beforeRenderToHtml to extract the styles into the page meta
  beforeRenderToHtml: (element, { meta }) => {
    meta.styledComponentsSheet = new ServerStyleSheet()
    return (
      <StyleSheetManager sheet={meta.styledComponentsSheet.instance}>
        {element}
      </StyleSheetManager>
    )
  },
  Head: ({ meta }) =>
    // The styles aren't fully extraced until the react component
    // has been rendered to an html string. So we wait until the head
    // to call the sheet's getStyleElement function
    // and then insert the tag into the Head
    meta.styledComponentsSheet.getStyleElement(),
})
