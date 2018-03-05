/* eslint-disable import/no-dynamic-require, react/no-danger */
import React from 'react'
import { renderToString } from 'react-dom/server'
import OpenPort from 'openport'
import fs from 'fs-extra'
//
import { Html, Head, Body } from '../static/RootComponents'

//

export const ChalkColor = {
  yarn: '#2c8ebb',
  npm: '#cb3837',
}

export const findAvailablePort = start =>
  new Promise((resolve, reject) =>
    OpenPort.find(
      {
        startingPort: start,
        endingPort: start + 1000,
      },
      (err, port) => {
        if (err) {
          return reject(err)
        }
        resolve(port)
      }
    )
  )

export function copyPublicFolder (config) {
  fs.ensureDirSync(config.paths.PUBLIC)

  fs.copySync(config.paths.PUBLIC, config.paths.DIST, {
    dereference: true,
    filter: file => file !== config.paths.INDEX,
  })
}

export async function createIndexFilePlaceholder ({ config, Component, siteData }) {
  // Render the base document component to string with siteprops
  const html = `<!DOCTYPE html>${renderToString(
    <Component renderMeta={{}} Html={Html} Head={Head} Body={Body} siteData={siteData}>
      <div id="root" />
    </Component>
  )}`

  // Write the Document to index.html
  await fs.outputFile(config.paths.HTML_TEMPLATE, html)
}

export function isArray (a) {
  return Array.isArray(a)
}

export function isObject (a) {
  return !Array.isArray(a) && typeof a === 'object' && a !== null
}
