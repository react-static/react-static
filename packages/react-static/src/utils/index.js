/* eslint-disable import/no-dynamic-require, react/no-danger */
import React from 'react'
import { renderToString } from 'react-dom/server'
import OpenPort from 'openport'
import fs from 'fs-extra'
import nodeGlob from 'glob'
import { performance } from 'perf_hooks'
//
import { DefaultDocument, Html, Head, Body } from '../static/RootComponents'

// Export all shared utils
export * from '../browser/utils'

export { default as progress } from './progress'
export const ChalkColor = {
  yarn: '#2c8ebb',
  npm: '#cb3837',
}

export const findAvailablePort = (start, avoid = []) =>
  new Promise((resolve, reject) =>
    OpenPort.find(
      {
        startingPort: start,
        endingPort: start + 1000,
        avoid,
      },
      (err, port) => {
        if (err) {
          return reject(err)
        }
        resolve(port)
      }
    )
  )

export function copyPublicFolder(config) {
  fs.ensureDirSync(config.paths.PUBLIC)

  fs.copySync(config.paths.PUBLIC, config.paths.DIST, {
    dereference: true,
    filter: file => file !== config.paths.INDEX,
  })
}

export async function createIndexFilePlaceholder({
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

export function glob(path, options = {}) {
  return new Promise((resolve, reject) =>
    nodeGlob(path, options, (err, files) => {
      if (err) {
        return reject(err)
      }
      resolve(files)
    })
  )
}

const times = {}
export function time(message) {
  times[message] = performance.now() / 1000
}
export function timeEnd(message) {
  if (times[message]) {
    let seconds = (performance.now() / 1000 - times[message]) * 10
    times[message] = null

    if (seconds < 0.1) {
      console.log(`${message}`)
      return
    }

    if (seconds < 1) {
      seconds = Math.round(seconds * 10) / 10
    } else {
      seconds = Math.round(seconds) / 10
    }
    console.log(`${message} (${seconds}s)`)
  }
}

export function debounce(func, wait, immediate) {
  let timeout
  return (...args) => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

const escapeReg = /[\\^$.*+?()[\]{}|]/g
export function escapeRegExp(str) {
  return str.replace(escapeReg, '\\$&')
}
