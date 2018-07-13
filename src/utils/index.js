/* eslint-disable import/no-dynamic-require, react/no-danger */
import React from 'react'
import { renderToString } from 'react-dom/server'
import OpenPort from 'openport'
import fs from 'fs-extra'
import nodeGlob from 'glob'
import { performance } from 'perf_hooks'
//
import { Html, Head, Body } from '../static/RootComponents'

//

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

export function copyPublicFolder (config) {
  fs.ensureDirSync(config.paths.PUBLIC)

  fs.copySync(config.paths.PUBLIC, config.paths.DIST, {
    dereference: true,
    filter: file => file !== config.paths.INDEX,
  })
}

export async function createIndexFilePlaceholder ({ config, Component, siteData }) {
  // Render the base document component to string with siteprops
  const DocumentHtml = renderToString(
    <Component renderMeta={{}} Html={Html} Head={Head} Body={Body} siteData={siteData}>
      <div id="root" />
    </Component>
  )
  const html = `<!DOCTYPE html>${DocumentHtml}`

  // Write the Document to index.html
  await fs.outputFile(config.paths.HTML_TEMPLATE, html)
}

export function isArray (a) {
  return Array.isArray(a)
}

export function isObject (a) {
  return !Array.isArray(a) && typeof a === 'object' && a !== null
}

export function glob (path, options = {}) {
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
export function time (message) {
  times[message] = performance.now() / 1000
}
export function timeEnd (message) {
  if (times[message]) {
    console.log(
      `${message} (${Math.round((performance.now() / 1000 - times[message]) * 10) / 10}s)`
    )
    times[message] = null
  }
}

export function debounce (func, wait, immediate) {
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
