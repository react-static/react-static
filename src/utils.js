/* eslint-disable import/no-dynamic-require, react/no-danger */
import React from 'react'
import { renderToString } from 'react-dom/server'
import OpenPort from 'openport'
import path from 'path'
import fs from 'fs-extra'

//

import { pathJoin } from './shared'
import { PUBLIC, INDEX, HTML_TEMPLATE } from './paths'
import { Html, Head, Body } from './RootComponents'

const defaultEntry = './src/index'

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
      },
    ),
  )

// Retrieves the static.config.js from the current project directory
export const getConfig = () => {
  const config = require(path.resolve(path.join(process.cwd(), 'static.config.js'))).default
  return {
    entry: defaultEntry,
    getSiteProps: () => ({}),
    renderToHtml: (render, Comp) => render(<Comp />),
    ...config,
    siteRoot: config.siteRoot ? config.siteRoot.replace(/\/{0,}$/g, '') : null,
    getRoutes: config.getRoutes
      ? async (...args) => {
        const routes = await config.getRoutes(...args)
        return normalizeRoutes(routes)
      }
      : async () =>
      // At least ensure the index page is defined for export
        normalizeRoutes([
          {
            path: '/',
          },
        ]),
  }
}

const path404 = '/404'

// Normalize routes with parents, full paths, context, etc.
export function normalizeRoutes (routes) {
  const flatRoutes = []

  const recurse = (route, parent = { path: '/' }) => {
    const routePath = route.is404 ? path404 : pathJoin(parent.path, route.path)

    if (typeof route.noIndex !== 'undefined') {
      console.log(`=> Warning: Route ${route.path} is using 'noIndex'. Did you mean 'noindex'?`)
      route.noindex = route.noIndex
    }

    const normalizedRoute = {
      ...route,
      path: routePath,
      noindex: typeof route.noindex === 'undefined' ? parent.noindex : route.noindex,
      hasGetProps: !!route.getProps,
    }

    if (!normalizedRoute.path) {
      throw new Error('No path defined for route:', normalizedRoute)
    }

    if (route.children) {
      route.children.forEach(d => recurse(d, normalizedRoute))
    }

    delete normalizedRoute.children

    flatRoutes.push(normalizedRoute)
  }
  routes.forEach(d => recurse(d))

  flatRoutes.forEach(route => {
    const found = flatRoutes.filter(d => d.path === route.path)
    if (found.length > 1) {
      console.warn('More than one route is defined for path:', route.path)
    }
  })

  if (!flatRoutes.find(d => d.is404)) {
    flatRoutes.push({
      is404: true,
      path: path404,
    })
  }

  return flatRoutes
}

export function copyPublicFolder (dest) {
  fs.ensureDirSync(PUBLIC)

  fs.copySync(PUBLIC, dest, {
    dereference: true,
    filter: file => file !== INDEX,
  })
}

export async function createIndexFilePlaceholder ({ Component, siteProps }) {
  // Render the base document component to string with siteprops
  const html = `<!DOCTYPE html>${renderToString(
    <Component renderMeta={{}} Html={Html} Head={Head} Body={Body} siteProps={siteProps}>
      <div id="root" />
    </Component>,
  )}`

  // Write the Document to index.html
  await fs.outputFile(HTML_TEMPLATE, html)
}
