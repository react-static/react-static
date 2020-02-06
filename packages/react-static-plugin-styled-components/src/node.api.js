import React from 'react'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

export default () => ({
  // Use beforeRenderToHtml to extract the styles into the page meta
  beforeRenderToHtml: (element, { meta }) => {
    meta.styledComponentsSheet = new ServerStyleSheet()
    return (
      <StyleSheetManager sheet={meta.styledComponentsSheet.instance}>
        {element}
      </StyleSheetManager>
    )
  },
  headElements: (elements, { meta }) => {
    // The styles aren't fully extracted until the react component
    // has been rendered to an html string. So we wait until the head
    // to call the sheet's getStyleElement function
    // and then insert the tag into the Head

    elements = [...elements, meta.styledComponentsSheet.getStyleElement()]

    return elements
  },
})
