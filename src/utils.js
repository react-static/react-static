/* eslint-disable import/no-dynamic-require, react/no-danger */
import React from 'react'
import { renderToString } from 'react-dom/server'
import OpenPort from 'openport'
import path from 'path'
import fs from 'fs-extra'

//

import { pathJoin } from './shared'
import { Html, Head, Body } from './RootComponents'

const defaultEntry = 'index.js'

export const ChalkColor = {
  yarn: '#2c8ebb',
  npm: '#cb3837'
}

export const findAvailablePort = start =>
  new Promise((resolve, reject) =>
    OpenPort.find(
      {
        startingPort: start,
        endingPort: start + 1000
      },
      (err, port) => {
        if (err) {
          return reject(err)
        }
        resolve(port)
      }
    )
  )

// Retrieves the static.config.js from the current project directory
export const getConfig = () => {
  const config = require(path.resolve(path.join(process.cwd(), 'static.config.js'))).default

  // path defaults
  config.paths = {
    src: 'src',
    dist: 'dist',
    public: 'public',
    ...(config.paths || {})
  }

  // Resolve the root of the project
  const ROOT = path.resolve(process.cwd())

  // Use the root to resolve all other relative paths
  const resolvePath = relativePath => path.resolve(path.join(ROOT, relativePath))

  // Resolve all paths
  const distPath =
    process.env.REACT_STATIC_ENV === 'development'
      ? resolvePath(config.paths.devDist || config.paths.dist)
      : resolvePath(config.paths.dist)
  const paths = {
    ROOT,
    LOCAL_NODE_MODULES: path.resolve(__dirname, '../node_modules'),
    SRC: resolvePath(config.paths.src),
    DIST: distPath,
    PUBLIC: resolvePath(config.paths.public),
    NODE_MODULES: resolvePath('node_modules'),
    PACKAGE: resolvePath('package.json'),
    HTML_TEMPLATE: path.join(distPath, 'index.html'),
    STATIC_DATA: path.join(distPath, 'staticData')
  }

  const siteRoot = config.siteRoot ? config.siteRoot.replace(/\/{0,}$/g, '') : null

  const getRoutes = config.getRoutes
    ? async (...args) => {
      const routes = await config.getRoutes(...args)
      return normalizeRoutes(routes)
    }
    : async () =>
    // At least ensure the index page is defined for export
      normalizeRoutes([
        {
          path: '/'
        }
      ])

  const finalConfig = {
    // Defaults
    entry: path.join(paths.SRC, defaultEntry),
    getSiteProps: () => ({}),
    renderToHtml: (render, Comp) => render(<Comp />),
    prefetchRate: 10,
    // Config Overrides
    ...config,
    // Materialized Overrides
    paths,
    siteRoot,
    getRoutes
  }

  // Set env variables to be used client side
  process.env.REACT_STATIC_PREFETCH_RATE = finalConfig.prefetchRate

  return finalConfig
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
      hasGetProps: !!route.getProps
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
      path: path404
    })
  }

  return flatRoutes
}

export function copyPublicFolder (config) {
  fs.ensureDirSync(config.paths.PUBLIC)

  fs.copySync(config.paths.PUBLIC, config.paths.DIST, {
    dereference: true,
    filter: file => file !== config.paths.INDEX
  })
}

export async function createIndexFilePlaceholder ({ config, Component, siteProps }) {
  // Render the base document component to string with siteprops
  const html = `<!DOCTYPE html>${renderToString(
    <Component renderMeta={{}} Html={Html} Head={Head} Body={Body} siteProps={siteProps}>
      <div id="root" />
    </Component>
  )}`

  // Write the Document to index.html
  await fs.outputFile(config.paths.HTML_TEMPLATE, html)
}
