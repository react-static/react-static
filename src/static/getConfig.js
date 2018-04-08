/* eslint-disable import/no-dynamic-require */

import React from 'react'
import path from 'path'
import chokidar from 'chokidar'
//
import { pathJoin } from '../utils/shared'
import { reloadRoutes } from './webpack'

//

const defaultEntry = 'index.js'
const path404 = '404'

// Retrieves the static.config.js from the current project directory
export default function getConfig (customConfig, { watch } = {}) {
  if (typeof customConfig === 'string') {
    // return a custom config file location
    return fromFile(customConfig)
  } else if (customConfig) {
    // return a custom config obj
    return build(customConfig)
  }

  // Return from the default static.config.js location
  return fromFile(path.resolve(path.join(process.cwd(), 'static.config.js')))

  function fromFile (configPath) {
    let config

    const buildConfig = () => {
      const filename = path.resolve(configPath)
      delete require.cache[filename]
      try {
        return build(require(configPath).default)
      } catch (err) {
        console.error(err)
        return config
      }
    }

    config = buildConfig()

    if (watch) {
      chokidar.watch(configPath).on('all', () => {
        Object.assign(config, buildConfig())
        reloadRoutes()
      })
    }

    return config
  }

  function build (config) {
    // path defaults
    config.paths = {
      root: path.resolve(process.cwd()),
      src: 'src',
      dist: 'dist',
      devDist: 'tmp/dev-server',
      public: 'public',
      ...(config.paths || {}),
    }

    // Use the root to resolve all other relative paths
    const resolvePath = relativePath => path.resolve(config.paths.root, relativePath)

    // Resolve all paths
    const distPath =
      process.env.REACT_STATIC_ENV === 'development'
        ? resolvePath(config.paths.devDist || config.paths.dist)
        : resolvePath(config.paths.dist)
    const paths = {
      ROOT: config.paths.root,
      LOCAL_NODE_MODULES: path.resolve(__dirname, '../../node_modules'),
      SRC: resolvePath(config.paths.src),
      DIST: distPath,
      PUBLIC: resolvePath(config.paths.public),
      NODE_MODULES: resolvePath('node_modules'),
      PACKAGE: resolvePath('package.json'),
      HTML_TEMPLATE: path.join(distPath, 'index.html'),
      STATIC_DATA: path.join(distPath, 'staticData'),
    }

    // Cut siteRoot to the suffix, no trailing slashes
    const siteRoot = config.siteRoot ? config.siteRoot.replace(/(\..+?)\/.*/g, '$1') : ''

    // Cut siteRoot to the suffix, no trailing slashes
    const stagingSiteRoot = config.stagingSiteRoot
      ? config.stagingSiteRoot.replace(/(\..+?)\/.*/g, '$1')
      : ''

    // Trim basePath of leading and trailing slashes
    const basePath = config.basePath
      ? config.basePath.replace(/\/{0,}$/g, '').replace(/^\/{0,}/g, '')
      : ''

    // Trim stagingBasePath of leading and trailing slashes
    const stagingBasePath = config.stagingBasePath
      ? config.stagingBasePath.replace(/\/{0,}$/g, '').replace(/^\/{0,}/g, '')
      : ''

    // Trim basePath of leading and trailing slashes
    const devBasePath = config.devBasePath
      ? config.devBasePath.replace(/\/{0,}$/g, '').replace(/^\/{0,}/g, '')
      : ''

    const getRoutes = config.getRoutes
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
        ])

    const finalConfig = {
      // Defaults
      entry: path.join(paths.SRC, defaultEntry),
      getSiteData: () => ({}),
      renderToHtml: (render, Comp) => render(<Comp />),
      prefetchRate: 10,
      outputFileRate: 10,
      // Config Overrides
      ...config,
      // Materialized Overrides
      paths,
      siteRoot: siteRoot || '',
      stagingSiteRoot: stagingSiteRoot || '',
      basePath: basePath || '',
      stagingBasePath: stagingBasePath || '',
      devBasePath: devBasePath || '',
      extractCssChunks: config.extractCssChunks || false,
      inlineCss: config.inlineCss || false,
      getRoutes,
    }

    // Set env variables to be used client side
    process.env.REACT_STATIC_PREFETCH_RATE = finalConfig.prefetchRate

    return finalConfig
  }
}

// Normalize routes with parents, full paths, context, etc.
function normalizeRoutes (routes) {
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
      hasGetProps: !!route.getData,
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
