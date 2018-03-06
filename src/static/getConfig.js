import React from 'react'
import path from 'path'
//
import { pathJoin } from '../utils/shared'

//

const defaultEntry = 'index.js'
const path404 = '404'

// Retrieves the static.config.js from the current project directory
export default function getConfig (customConfig) {
  /* eslint-disable import/no-dynamic-require */
  let config
  if (typeof customConfig === 'string') {
    config = require(path.resolve(customConfig)).default
  } else if (customConfig) {
    config = customConfig
  } else {
    config = require(path.resolve(path.join(process.cwd(), 'static.config.js'))).default
  }

  // path defaults
  config.paths = {
    src: 'src',
    dist: 'dist',
    public: 'public',
    ...(config.paths || {}),
  }

  // Resolve the root of the project
  const ROOT = path.resolve(process.cwd())

  // Use the root to resolve all other relative paths
  const resolvePath = relativePath => path.resolve(ROOT, relativePath)

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
    getRoutes,
  }

  // Set env variables to be used client side
  process.env.REACT_STATIC_PREFETCH_RATE = finalConfig.prefetchRate

  return finalConfig
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
