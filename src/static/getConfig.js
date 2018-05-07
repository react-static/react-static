/* eslint-disable import/no-dynamic-require */

import React from 'react'
import path from 'path'
import chokidar from 'chokidar'
//
import { pathJoin, trimSlashes, cleanSlashes } from '../utils/shared'
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
    const { disableDuplicateRoutesWarning } = config

    // path defaults
    config.paths = {
      root: path.resolve(process.cwd()),
      src: 'src',
      dist: 'dist',
      devDist: 'tmp/dev-server',
      public: 'public',
      assets: '',
      ...(config.paths || {}),
    }

    // Use the root to resolve all other relative paths
    const resolvePath = relativePath => path.resolve(config.paths.root, relativePath)

    // Resolve all paths
    const distPath =
      process.env.REACT_STATIC_ENV === 'development'
        ? resolvePath(config.paths.devDist || config.paths.dist)
        : resolvePath(config.paths.dist)

    const assetsPath = path.join(distPath, config.paths.assets)

    const paths = {
      ROOT: config.paths.root,
      LOCAL_NODE_MODULES: path.resolve(__dirname, '../../node_modules'),
      SRC: resolvePath(config.paths.src),
      DIST: distPath,
      ASSETS: assetsPath,
      PUBLIC: resolvePath(config.paths.public),
      NODE_MODULES: resolvePath('node_modules'),
      PACKAGE: resolvePath('package.json'),
      HTML_TEMPLATE: path.join(distPath, 'index.html'),
      STATIC_DATA: path.join(assetsPath, 'staticData'),
    }

    let siteRoot = (process.env.REACT_STATIC_STAGING === 'true' ? config.stagingSiteRoot : config.siteRoot) || ''
    if (siteRoot) {
      siteRoot = siteRoot.replace(/(\..+?)\/.*/g, '$1')
    }

    let basePath
    if (process.env.REACT_STATIC_ENV === 'development') {
      basePath = trimSlashes(config.devBasePath)
    } else if (process.env.REACT_STATIC_STAGING === 'true') {
      basePath = trimSlashes(config.stagingBasePath)
    } else {
      basePath = trimSlashes(config.basePath)
    }

    let publicPath = cleanSlashes(`/${basePath}/`)
    if (process.env.REACT_STATIC_ENV !== 'development') {
      publicPath = cleanSlashes(`${siteRoot}/${publicPath}`)
    }

    const getRoutes = config.getRoutes
      ? async (...args) => {
        const routes = await config.getRoutes(...args)
        return normalizeRoutes(routes, { disableDuplicateRoutesWarning })
      }
      : async () =>
      // At least ensure the index page is defined for export
        normalizeRoutes(
          [
            {
              path: '/',
            },
          ],
          { disableDuplicateRoutesWarning }
        )

    const finalConfig = {
      // Defaults
      entry: path.join(paths.SRC, defaultEntry),
      getSiteData: () => ({}),
      renderToHtml: (render, Comp) => render(<Comp />),
      prefetchRate: 3,
      disableDuplicateRoutesWarning: false,
      disableRouteInfoWarning: false,
      disableRoutePrefixing: false,
      outputFileRate: 10,
      // Config Overrides
      ...config,
      // Materialized Overrides
      paths,
      siteRoot,
      basePath,
      publicPath,
      assetsPath: cleanSlashes(`${publicPath}/${config.paths.assets || ''}/`),
      extractCssChunks: config.extractCssChunks || false,
      inlineCss: config.inlineCss || false,
      getRoutes,
    }

    // Set env variables to be used client side
    process.env.REACT_STATIC_PREFETCH_RATE = finalConfig.prefetchRate
    process.env.REACT_STATIC_DISABLE_ROUTE_INFO_WARNING = finalConfig.disableRouteInfoWarning
    process.env.REACT_STATIC_DISABLE_ROUTE_PREFIXING = finalConfig.disableRoutePrefixing

    return finalConfig
  }
}

// Normalize routes with parents, full paths, context, etc.
export function normalizeRoutes (routes, config = {}) {
  const { tree, disableDuplicateRoutesWarning, force404 } = { force404: true, ...config }
  const flatRoutes = []

  const recurse = (route, parent = { path: '/' }) => {
    const originalPath = route.is404 ? path404 : pathJoin(route.path)
    const routePath = route.is404 ? path404 : pathJoin(parent.path, route.path)

    if (typeof route.noIndex !== 'undefined') {
      console.log(`=> Warning: Route ${route.path} is using 'noIndex'. Did you mean 'noindex'?`)
      route.noindex = route.noIndex
    }

    const normalizedRoute = {
      ...route,
      originalPath,
      path: routePath,
      noindex: typeof route.noindex === 'undefined' ? parent.noindex : route.noindex,
      hasGetProps: !!route.getData,
    }

    if (!normalizedRoute.path) {
      throw new Error('No path defined for route:', normalizedRoute)
    }

    if (normalizedRoute.children) {
      normalizedRoute.children = route.children.map(d => recurse(d, normalizedRoute))
    }

    if (!tree) {
      delete normalizedRoute.children
    }

    const found = flatRoutes.find(d => d.path === normalizedRoute.path)

    if (!found) {
      flatRoutes.push(normalizedRoute)
    } else if (!disableDuplicateRoutesWarning) {
      console.warn('More than one route is defined for path:', route.path)
    }

    return normalizedRoute
  }

  const normalizedRoutes = routes.map(d => recurse(d))

  if (force404 && !flatRoutes.find(d => d.is404)) {
    flatRoutes.push({
      is404: true,
      path: path404,
    })
  }

  return tree ? normalizedRoutes : flatRoutes
}
