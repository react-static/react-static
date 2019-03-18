import React from 'react'
import { renderToString } from 'react-dom/server'
import fs from 'fs-extra'
import {
  DefaultDocument,
  Html,
  Head,
  Body,
} from '../static/components/RootComponents'

export default async function createIndexPlaceholder({
  config: { Document, paths, siteData },
}) {
  // Render the base document component to string with siteprops
  const Component = Document || DefaultDocument
  const DocumentHtml = renderToString(
    <Component
      renderMeta={{}}
      Html={Html}
      Head={Head}
      Body={Body}
      siteData={siteData}
    >
      <div id="root" />
    </Component>
  )
  const html = `<!DOCTYPE html>${DocumentHtml}`

  // Write the Document to index.html
  await fs.outputFile(paths.HTML_TEMPLATE, html)
}
