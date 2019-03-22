import React from 'react'
import { renderToString } from 'react-dom/server'
import fs from 'fs-extra'
import {
  DefaultDocument,
  Html,
  Head,
  Body,
} from '../static/components/RootComponents'

export default async function createIndexPlaceholder(state) {
  const {
    config: { Document, paths },
  } = state
  // Render the base document component to string with siteprops
  const Component = Document || DefaultDocument
  const DocumentHtml = renderToString(
    <Component Html={Html} Head={Head} Body={Body} state={state}>
      <div id="root" />
    </Component>
  )
  const html = `<!DOCTYPE html>${DocumentHtml}`

  // Write the Document to index.html
  await fs.outputFile(paths.HTML_TEMPLATE, html)

  return state
}
